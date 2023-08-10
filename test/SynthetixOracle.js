const { ethers } = require('hardhat');
const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { expect, assertRoughlyEqualValues, deployContract } = require('@1inch/solidity-utils');
const {
    tokens,
    deployParams: { Synthetix, UniswapV3 },
    defaultValues: { thresholdFilter },
} = require('./helpers.js');

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

    async function initContracts () {
        const synthetixOracle = await deployContract('SynthetixOracle', [Synthetix.proxy]);
        const uniswapV3Oracle = await deployContract('UniswapV3LikeOracle', [UniswapV3.factory, UniswapV3.initcodeHash, UniswapV3.fees]);
        return { synthetixOracle, uniswapV3Oracle };
    }

    it('should revert for unregistered token', async function () {
        const { synthetixOracle } = await loadFixture(initContracts);
        const incorrectSREN = '0x4287dac1cC7434991119Eba7413189A66fFE65cF';
        await expect(
            synthetixOracle.callStatic.getRate(incorrectSREN, tokens.sKRW, tokens.NONE, thresholdFilter),
        ).to.be.revertedWithCustomError(synthetixOracle, 'UnregisteredToken');
    });

    it('should revert on connector usage', async function () {
        const { synthetixOracle, uniswapV3Oracle } = await loadFixture(initContracts);
        await expect(
            testRate([tokens.sBTC, tokens.WBTC], [tokens.ETH, tokens.WETH], tokens.USDC, synthetixOracle, uniswapV3Oracle),
        ).to.be.revertedWithCustomError(synthetixOracle, 'ConnectorShouldBeNone');
    });

    it('BTC -> ETH', async function () {
        const { synthetixOracle, uniswapV3Oracle } = await loadFixture(initContracts);
        await testRate([tokens.sBTC, tokens.WBTC], [tokens.ETH, tokens.WETH], tokens.NONE, synthetixOracle, uniswapV3Oracle);
    });

    it('ETH -> BTC', async function () {
        const { synthetixOracle, uniswapV3Oracle } = await loadFixture(initContracts);
        await testRate([tokens.ETH, tokens.WETH], [tokens.sBTC, tokens.WBTC], tokens.NONE, synthetixOracle, uniswapV3Oracle);
    });

    it('USDC -> ETH', async function () {
        const { synthetixOracle, uniswapV3Oracle } = await loadFixture(initContracts);
        await testRate([tokens.sUSD, tokens.USDC], [tokens.ETH, tokens.WETH], tokens.NONE, synthetixOracle, uniswapV3Oracle);
    });

    it('ETH -> USDC', async function () {
        const { synthetixOracle, uniswapV3Oracle } = await loadFixture(initContracts);
        await testRate([tokens.ETH, tokens.WETH], [tokens.sUSD, tokens.USDC], tokens.NONE, synthetixOracle, uniswapV3Oracle);
    });

    it('SNX -> ETH', async function () {
        const { synthetixOracle, uniswapV3Oracle } = await loadFixture(initContracts);
        await testRate([tokens.SNX, tokens.SNX], [tokens.ETH, tokens.WETH], tokens.NONE, synthetixOracle, uniswapV3Oracle);
    });

    it('ETH -> SNX', async function () {
        const { synthetixOracle, uniswapV3Oracle } = await loadFixture(initContracts);
        await testRate([tokens.ETH, tokens.WETH], [tokens.SNX, tokens.SNX], tokens.NONE, synthetixOracle, uniswapV3Oracle);
    });

    async function testRate (srcTokens, dstTokens, connector, synthetixOracle, uniswapV3Oracle) {
        const synthResult = await synthetixOracle.getRate(srcTokens[0], dstTokens[0], connector, thresholdFilter);
        const v3Result = await uniswapV3Oracle.getRate(srcTokens[1], dstTokens[1], connector, thresholdFilter);

        let actualResult = synthResult.rate.toBigInt();
        let expectedResult = v3Result.rate.toBigInt();
        const srcActualDecimals = await getDecimals(srcTokens[0]);
        const srcExpectedDecimals = await getDecimals(srcTokens[1]);
        const dstActualDecimals = await getDecimals(dstTokens[0]);
        const dstExpectedDecimals = await getDecimals(dstTokens[1]);

        if (srcActualDecimals > srcExpectedDecimals) {
            const diff = srcActualDecimals - srcExpectedDecimals;
            expectedResult = expectedResult / (10n ** diff);
        }

        if (dstActualDecimals > dstExpectedDecimals) {
            const diff = dstActualDecimals - dstExpectedDecimals;
            actualResult = actualResult / (10n ** diff);
        }

        assertRoughlyEqualValues(expectedResult.toString(), actualResult.toString(), 0.05);
    }

    async function getDecimals (token) {
        if (token === tokens.ETH || token === token.EEE) {
            return 18n;
        }
        const ERC20 = await ethers.getContractFactory('ERC20');
        return BigInt(await (await ERC20.attach(token)).decimals());
    }
});
