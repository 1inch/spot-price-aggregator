const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { ethers } = require('hardhat');
const { assertRoughlyEqualValues, deployContract } = require('@1inch/solidity-utils');
const { tokens, deployParams: { AaveWrapperV2, Curve, Uniswap, UniswapV2 } } = require('./helpers.js');

describe('CurveOracle', function () {
    async function initContracts () {
        const curveOracle = await deployContract('CurveOracle', [Curve.provider]);
        const uniswapV2LikeOracle = await deployContract('UniswapV2LikeOracle', [UniswapV2.factory, UniswapV2.initcodeHash]);
        return { curveOracle, uniswapV2LikeOracle };
    }

    it('usdt -> wbtc', async function () {
        const { curveOracle, uniswapV2LikeOracle } = await loadFixture(initContracts);
        const rate = await curveOracle.getRate(tokens.USDT, tokens.WBTC, tokens.NONE);
        const expectedRate = await uniswapV2LikeOracle.getRate(tokens.USDT, tokens.WBTC, tokens.NONE);
        assertRoughlyEqualValues(rate.rate.toString(), expectedRate.rate.toString(), '0.05');
    });

    it('wbtc -> usdc', async function () {
        const { curveOracle, uniswapV2LikeOracle } = await loadFixture(initContracts);
        const expectedRate = await uniswapV2LikeOracle.getRate(tokens.WBTC, tokens.USDT, tokens.NONE);
        const rate = await curveOracle.getRate(tokens.WBTC, tokens.USDT, tokens.NONE);
        assertRoughlyEqualValues(rate.rate.toString(), expectedRate.rate.toString(), '0.05');
    });

    it('wbtc -> weth', async function () {
        const { curveOracle, uniswapV2LikeOracle } = await loadFixture(initContracts);
        const expectedRate = await uniswapV2LikeOracle.getRate(tokens.WBTC, tokens.WETH, tokens.NONE);
        const rate = await curveOracle.getRate(tokens.WBTC, tokens.WETH, tokens.NONE);
        assertRoughlyEqualValues(rate.rate.toString(), expectedRate.rate.toString(), '0.05');
    });
});

describe('CurveOracle doesn\'t ruin rates', function () {
    async function initContracts () {
        const thresholdFilter = 10;
        const deployer = await ethers.getSigner();

        const uniswapV2LikeOracle = await deployContract('UniswapV2LikeOracle', [UniswapV2.factory, UniswapV2.initcodeHash]);
        const curveOracle = await deployContract('CurveOracle', [Curve.provider]);
        const uniswapOracle = await deployContract('UniswapOracle', [Uniswap.factory]);
        const mooniswapOracle = await deployContract('MooniswapOracle', [tokens.oneInchLP1]);
        const wethWrapper = await deployContract('BaseCoinWrapper', [tokens.WETH]);
        const aaveWrapperV1 = await deployContract('AaveWrapperV1');
        const aaveWrapperV2 = await deployContract('AaveWrapperV2', [AaveWrapperV2.lendingPool]);
        await aaveWrapperV1.addMarkets([tokens.DAI]);
        await aaveWrapperV2.addMarkets([tokens.DAI]);
        const multiWrapper = await deployContract('MultiWrapper', [[
            wethWrapper.address,
            aaveWrapperV1.address,
            aaveWrapperV2.address,
        ]]);

        const oldOffchainOracle = await deployContract('OffchainOracle', [
            multiWrapper.address,
            [
                uniswapV2LikeOracle.address,
                uniswapOracle.address,
                mooniswapOracle.address,
            ],
            [
                '0',
                '1',
                '2',
            ],
            [
                tokens.NONE,
                tokens.ETH,
                tokens.WETH,
                tokens.USDC,
                tokens.DAI,
            ],
            tokens.WETH,
            deployer.address,
        ]);

        const newOffchainOracle = await deployContract('OffchainOracle', [
            multiWrapper.address,
            [
                uniswapV2LikeOracle.address,
                uniswapOracle.address,
                mooniswapOracle.address,
                curveOracle.address,
            ],
            [
                '0',
                '1',
                '2',
                '2',
            ],
            [
                tokens.NONE,
                tokens.ETH,
                tokens.USDC,
                tokens.DAI,
            ],
            tokens.WETH,
            deployer.address,
        ]);

        return { oldOffchainOracle, newOffchainOracle, thresholdFilter };
    }

    it('WBTC WETH', async function () {
        const { oldOffchainOracle, newOffchainOracle, thresholdFilter } = await loadFixture(initContracts);
        await testRate(tokens.WBTC, tokens.WETH, oldOffchainOracle, newOffchainOracle, thresholdFilter);
    });

    it('WETH WBTC', async function () {
        const { oldOffchainOracle, newOffchainOracle, thresholdFilter } = await loadFixture(initContracts);
        await testRate(tokens.WETH, tokens.WBTC, oldOffchainOracle, newOffchainOracle, thresholdFilter);
    });

    it('WBTC USDT', async function () {
        const { oldOffchainOracle, newOffchainOracle, thresholdFilter } = await loadFixture(initContracts);
        await testRate(tokens.WBTC, tokens.USDT, oldOffchainOracle, newOffchainOracle, thresholdFilter);
    });

    async function testRate (srcToken, dstToken, oldOffchainOracle, newOffchainOracle, thresholdFilter) {
        const expectedRate = await oldOffchainOracle.getRateWithThreshold(srcToken, dstToken, true, thresholdFilter);
        const actualRate = await newOffchainOracle.getRateWithThreshold(srcToken, dstToken, true, thresholdFilter);
        const expectedReverseRate = await oldOffchainOracle.getRateWithThreshold(srcToken, dstToken, true, thresholdFilter);
        const actualReverseRate = await newOffchainOracle.getRateWithThreshold(srcToken, dstToken, true, thresholdFilter);
        assertRoughlyEqualValues(actualRate.toString(), expectedRate.toString(), '0.05');
        assertRoughlyEqualValues(actualReverseRate.toString(), expectedReverseRate.toString(), '0.05');
    }
});
