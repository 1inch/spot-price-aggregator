const { tokens, assertRoughlyEqualValues } = require('./helpers.js');

const uniswapV2Factory = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f';
const initcodeHash = '0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f';
const oneInchLP1 = '0xbAF9A5d4b0052359326A6CDAb54BABAa3a3A9643';
const curveRegistry = '0x0000000022D53366457F9d5E68Ec105046FC4383';

const BaseCoinWrapper = artifacts.require('BaseCoinWrapper');
const CurveOracle = artifacts.require('CurveOracle');
const UniswapV2LikeOracle = artifacts.require('UniswapV2LikeOracle');
const UniswapOracle = artifacts.require('UniswapOracle');
const MooniswapOracle = artifacts.require('MooniswapOracle');
const OffchainOracle = artifacts.require('OffchainOracle');
const AaveWrapperV1 = artifacts.require('AaveWrapperV1');
const AaveWrapperV2 = artifacts.require('AaveWrapperV2');
const MultiWrapper = artifacts.require('MultiWrapper');

describe('CurveOracle', async function () {
    before(async function () {
        this.curveOracle = await CurveOracle.new(curveRegistry);
        this.uniswapV2LikeOracle = await UniswapV2LikeOracle.new(uniswapV2Factory, initcodeHash);
    });

    it('usdt -> wbtc', async function () {
        const rate = await this.curveOracle.getRate(tokens.USDT, tokens.WBTC, tokens.NONE);
        const expectedRate = await this.uniswapV2LikeOracle.getRate(tokens.USDT, tokens.WBTC, tokens.NONE);
        assertRoughlyEqualValues(rate.rate.toString(), expectedRate.rate.toString(), '0.05');
    });

    it('wbtc -> usdc', async function () {
        const expectedRate = await this.uniswapV2LikeOracle.getRate(tokens.WBTC, tokens.USDT, tokens.NONE);
        const rate = await this.curveOracle.getRate(tokens.WBTC, tokens.USDT, tokens.NONE);
        assertRoughlyEqualValues(rate.rate.toString(), expectedRate.rate.toString(), '0.05');
    });

    it('wbtc -> weth', async function () {
        const expectedRate = await this.uniswapV2LikeOracle.getRate(tokens.WBTC, tokens.WETH, tokens.NONE);
        const rate = await this.curveOracle.getRate(tokens.WBTC, tokens.WETH, tokens.NONE);
        assertRoughlyEqualValues(rate.rate.toString(), expectedRate.rate.toString(), '0.05');
    });
});

describe('CurveOracle doesn\'t ruin rates', async function () {
    before(async function () {
        this.uniswapV2LikeOracle = await UniswapV2LikeOracle.new(uniswapV2Factory, initcodeHash);
        this.curveOracle = await CurveOracle.new(curveRegistry);
        this.uniswapOracle = await UniswapOracle.new('0xc0a47dFe034B400B47bDaD5FecDa2621de6c4d95');
        this.mooniswapOracle = await MooniswapOracle.new(oneInchLP1);

        this.wethWrapper = await BaseCoinWrapper.new(tokens.WETH);
        this.aaveWrapperV1 = await AaveWrapperV1.new();
        this.aaveWrapperV2 = await AaveWrapperV2.new('0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9');
        await this.aaveWrapperV1.addMarkets([tokens.DAI]);
        await this.aaveWrapperV2.addMarkets([tokens.DAI]);
        this.multiWrapper = await MultiWrapper.new(
            [
                this.wethWrapper.address,
                this.aaveWrapperV1.address,
                this.aaveWrapperV2.address,
            ],
        );

        this.oldOffchainOracle = await OffchainOracle.new(
            this.multiWrapper.address,
            [
                this.uniswapV2LikeOracle.address,
                this.uniswapOracle.address,
                this.mooniswapOracle.address,
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
        );

        this.newOffchainOracle = await OffchainOracle.new(
            this.multiWrapper.address,
            [
                this.uniswapV2LikeOracle.address,
                this.uniswapOracle.address,
                this.mooniswapOracle.address,
                this.curveOracle.address,
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
        );
    });

    it('WBTC WETH', async function () {
        await testRate(this, tokens.WBTC, tokens.WETH);
    });

    it('WETH WBTC', async function () {
        await testRate(this, tokens.WETH, tokens.WBTC);
    });

    it('WBTC USDT', async function () {
        await testRate(this, tokens.WBTC, tokens.USDT);
    });

    async function testRate (self, srcToken, dstToken) {
        const expectedRate = await self.oldOffchainOracle.getRate(srcToken, dstToken, true);
        const actualRate = await self.newOffchainOracle.getRate(srcToken, dstToken, true);
        const expectedReverseRate = await self.oldOffchainOracle.getRate(srcToken, dstToken, true);
        const actualReverseRate = await self.newOffchainOracle.getRate(srcToken, dstToken, true);
        assertRoughlyEqualValues(actualRate.toString(), expectedRate.toString(), '0.05');
        assertRoughlyEqualValues(actualReverseRate.toString(), expectedReverseRate.toString(), '0.05');
    }
});
