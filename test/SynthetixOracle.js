const { expectRevert, BN } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const { tokens, assertRoughlyEqualValues } = require('./helpers.js');

const SynthetixOracle = artifacts.require('SynthetixOracle');
const UniswapV3Oracle = artifacts.require('UniswapV3Oracle');
const ERC20 = artifacts.require('ERC20');
const initcodeHashV3 = '0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54';

describe('SynthetixOracle', async function () {
    function symbolToBytes (symbol) {
        let result = '0x';
        for (let i = 0; i < symbol.length; i++) {
            result += parseInt(symbol.charCodeAt(i)).toString(16);
        }
        return result;
    }

    it('should correctly convert bytes to symbol on JS side', async function () {
        expect(symbolToBytes('sLINK')).equal('0x734c494e4b');
        expect(symbolToBytes('sKRW')).equal('0x734b5257');
    });

    before(async function () {
        this.synthetixOracle = await SynthetixOracle.new('0x4E3b31eB0E5CB73641EE1E65E7dCEFe520bA3ef2');
        this.uniswapV3Oracle = await UniswapV3Oracle.new(initcodeHashV3);
    });

    it('should revert for unregistered token', async function () {
        const incorrectSREN = '0x4287dac1cC7434991119Eba7413189A66fFE65cF';

        await expectRevert(
            this.synthetixOracle.contract.methods.getRate(incorrectSREN, tokens.sKRW, tokens.NONE).call(),
            'SO: unregistered token',
        );
    });

    it('should revert on connector usage', async function () {
        await expectRevert(
            testRate(this, [tokens.sAAVE, tokens.AAVE], [tokens.ETH, tokens.WETH], tokens.USDC),
            'SO: connector should be None',
        );
    });

    it('AAVE -> ETH', async function () {
        await testRate(this, [tokens.sAAVE, tokens.AAVE], [tokens.ETH, tokens.WETH], tokens.NONE);
    });

    it('ETH -> AAVE', async function () {
        await testRate(this, [tokens.ETH, tokens.WETH], [tokens.sAAVE, tokens.AAVE], tokens.NONE);
    });

    it('USDC -> ETH', async function () {
        await testRate(this, [tokens.sUSD, tokens.USDC], [tokens.ETH, tokens.WETH], tokens.NONE);
    });

    it('ETH -> USDC', async function () {
        await testRate(this, [tokens.ETH, tokens.WETH], [tokens.sUSD, tokens.USDC], tokens.NONE);
    });

    it('SNX -> ETH', async function () {
        await testRate(this, [tokens.SNX, tokens.SNX], [tokens.ETH, tokens.WETH], tokens.NONE);
    });

    it('ETH -> SNX', async function () {
        await testRate(this, [tokens.ETH, tokens.WETH], [tokens.SNX, tokens.SNX], tokens.NONE);
    });

    async function testRate (self, srcTokens, dstTokens, connector) {
        const synthResult = await self.synthetixOracle.getRate(srcTokens[0], dstTokens[0], connector);
        const v3Result = await self.uniswapV3Oracle.getRate(srcTokens[1], dstTokens[1], connector);

        let actualResult = synthResult.rate;
        let expectedResult = v3Result.rate;
        const srcActualDecimals = await getDecimals(srcTokens[0]);
        const srcExpectedDecimals = await getDecimals(srcTokens[1]);
        const dstActualDecimals = await getDecimals(dstTokens[0]);
        const dstExpectedDecimals = await getDecimals(dstTokens[1]);

        if (srcActualDecimals.gt(srcExpectedDecimals)) {
            const diff = srcActualDecimals.sub(srcExpectedDecimals);
            expectedResult = expectedResult.div(new BN('10').pow(diff));
        }

        if (dstActualDecimals.gt(dstExpectedDecimals)) {
            const diff = dstActualDecimals.sub(dstExpectedDecimals);
            actualResult = actualResult.div(new BN('10').pow(diff));
        }

        assertRoughlyEqualValues(expectedResult.toString(), actualResult.toString(), 0.05);
    }

    async function getDecimals (token) {
        if (token === tokens.ETH || token === token.EEE) {
            return new BN('18');
        }
        return (await (await ERC20.at(token)).decimals());
    }
});
