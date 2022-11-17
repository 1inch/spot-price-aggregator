const { ethers } = require('hardhat');
const { expect } = require('@1inch/solidity-utils');
const { BigNumber: BN } = require('ethers');
const { tokens, assertRoughlyEqualValues } = require('./helpers.js');

describe('SynthetixOracle', function () {
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
        const SynthetixOracle = await ethers.getContractFactory('SynthetixOracle');
        const UniswapV3Oracle = await ethers.getContractFactory('UniswapV3Oracle');
        this.synthetixOracle = await SynthetixOracle.deploy('0x4E3b31eB0E5CB73641EE1E65E7dCEFe520bA3ef2');
        await this.synthetixOracle.deployed();
        this.uniswapV3Oracle = await UniswapV3Oracle.deploy();
        await this.uniswapV3Oracle.deployed();
    });

    it('should revert for unregistered token', async function () {
        const incorrectSREN = '0x4287dac1cC7434991119Eba7413189A66fFE65cF';

        await expect(
            this.synthetixOracle.callStatic.getRate(incorrectSREN, tokens.sKRW, tokens.NONE),
        ).to.be.revertedWith('SO: unregistered token');
    });

    it('should revert on connector usage', async function () {
        await expect(
            testRate(this, [tokens.sAAVE, tokens.AAVE], [tokens.ETH, tokens.WETH], tokens.USDC),
        ).to.be.revertedWith('SO: connector should be None');
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
            expectedResult = expectedResult.div(BN.from('10').pow(diff));
        }

        if (dstActualDecimals.gt(dstExpectedDecimals)) {
            const diff = dstActualDecimals.sub(dstExpectedDecimals);
            actualResult = actualResult.div(BN.from('10').pow(diff));
        }

        assertRoughlyEqualValues(expectedResult.toString(), actualResult.toString(), 0.05);
    }

    async function getDecimals (token) {
        if (token === tokens.ETH || token === token.EEE) {
            return BN.from('18');
        }
        const ERC20 = await ethers.getContractFactory('ERC20');
        return BN.from(await (await ERC20.attach(token)).decimals());
    }
});
