const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { tokens, assertRoughlyEqualValues, deployContract } = require('./helpers.js');

const uniswapV2Factory = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f';
const initcodeHash = '0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f';
const oneInchLP1 = '0xbAF9A5d4b0052359326A6CDAb54BABAa3a3A9643';
const curveRegistry = '0x0000000022D53366457F9d5E68Ec105046FC4383';

describe('CurveOracle', function () {
    async function initContracts () {
        const curveOracle = await deployContract('CurveOracle', [curveRegistry]);
        const uniswapV2LikeOracle = await deployContract('UniswapV2LikeOracle', [uniswapV2Factory, initcodeHash]);
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

        const uniswapV2LikeOracle = await deployContract('UniswapV2LikeOracle', [uniswapV2Factory, initcodeHash]);
        const curveOracle = await deployContract('CurveOracle', [curveRegistry]);
        const uniswapOracle = await deployContract('UniswapOracle', ['0xc0a47dFe034B400B47bDaD5FecDa2621de6c4d95']);
        const mooniswapOracle = await deployContract('MooniswapOracle', [oneInchLP1]);
        const wethWrapper = await deployContract('BaseCoinWrapper', [tokens.WETH]);
        const aaveWrapperV1 = await deployContract('AaveWrapperV1');
        const aaveWrapperV2 = await deployContract('AaveWrapperV2', ['0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9']);
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
