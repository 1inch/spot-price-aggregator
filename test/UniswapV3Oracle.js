const { tokens, assertRoughlyEquals, getUniswapV3Fee } = require('./helpers.js');

const UniswapV2LikeOracle = artifacts.require('UniswapV2LikeOracle');
const UniswapV3Oracle = artifacts.require('UniswapV3Oracle');
const UniswapOracle = artifacts.require('UniswapOracle');
const BaseCoinWrapper = artifacts.require('BaseCoinWrapper');
const MooniswapOracle = artifacts.require('MooniswapOracle');
const OffchainOracle = artifacts.require('OffchainOracle');
const AaveWrapperV1 = artifacts.require('AaveWrapperV1');
const AaveWrapperV2 = artifacts.require('AaveWrapperV2');
const MultiWrapper = artifacts.require('MultiWrapper');
const uniswapV2Factory = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f';
const uniswapV3Factory = '0x1F98431c8aD98523631AE4a59f267346ea31F984';
const initcodeHash = '0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f';
const oneInchLP1 = '0xbAF9A5d4b0052359326A6CDAb54BABAa3a3A9643';

describe('UniswapV3Oracle', async function () {
    before(async function () {
        this.uniswapV2LikeOracle = await UniswapV2LikeOracle.new(uniswapV2Factory, initcodeHash);
        this.uniswapV3Oracle = await UniswapV3Oracle.new(uniswapV3Factory, [
            getUniswapV3Fee(0.05),
            getUniswapV3Fee(0.3),
            getUniswapV3Fee(1.0),
        ]);
    });

    it('dai -> weth', async function () {
        await testRate(this, tokens.DAI, tokens.WETH, tokens.NONE);
    });

    it('weth -> dai', async function () {
        await testRate(this, tokens.WETH, tokens.DAI, tokens.NONE);
    });

    it('WETH -> USDT', async function () {
        await testRate(this, tokens.WETH, tokens.USDT, tokens.NONE);
    });

    it('USDT -> WETH', async function () {
        await testRate(this, tokens.USDT, tokens.WETH, tokens.NONE);
    });

    it('UNI -> WETH', async function () {
        await testRate(this, tokens.UNI, tokens.WETH, tokens.NONE);
    });

    it('WETH -> UNI', async function () {
        await testRate(this, tokens.WETH, tokens.UNI, tokens.NONE);
    });

    it('AAVE -> WETH', async function () {
        await testRate(this, tokens.AAVE, tokens.WETH, tokens.NONE);
    });

    it('WETH -> AAVE', async function () {
        await testRate(this, tokens.WETH, tokens.AAVE, tokens.NONE);
    });

    it('weth -> usdc -> dai', async function () {
        await testRate(this, tokens.WETH, tokens.DAI, tokens.USDC);
    });

    it('dai -> usdc -> weth', async function () {
        await testRate(this, tokens.DAI, tokens.WETH, tokens.USDC);
    });

    async function testRate (self, srcToken, dstToken, connector) {
        const v2Result = await self.uniswapV2LikeOracle.getRate(srcToken, dstToken, connector);
        const v3Result = await self.uniswapV3Oracle.getRateForFee(srcToken, dstToken, connector, getUniswapV3Fee(0.3));
        assertRoughlyEquals(v3Result.rate.toString(), v2Result.rate.toString(), 2);
    }
});

describe('UniswapV3Oracle doesn\'t ruin rates', async function () {
    before(async function () {
        this.uniswapV2LikeOracle = await UniswapV2LikeOracle.new(uniswapV2Factory, initcodeHash);
        this.uniswapV3Oracle = await UniswapV3Oracle.new(uniswapV3Factory, [
            getUniswapV3Fee(0.05),
            getUniswapV3Fee(0.3),
            getUniswapV3Fee(1.0),
        ]);
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
                this.uniswapV3Oracle.address,
            ],
            [
                '0',
                '1',
                '2',
                '0',
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
    });

    it('ETH DAI', async function () {
        await testRate(this, tokens.ETH, tokens.DAI);
    });

    it('WETH DAI', async function () {
        await testRate(this, tokens.WETH, tokens.DAI);
    });

    it('USDC DAI', async function () {
        await testRate(this, tokens.USDC, tokens.DAI);
    });

    it('USDC WETH', async function () {
        await testRate(this, tokens.USDC, tokens.WETH);
    });

    async function testRate (self, srcToken, dstToken) {
        const expectedRate = await self.oldOffchainOracle.getRate(srcToken, dstToken, true);
        const actualRate = await self.newOffchainOracle.getRate(srcToken, dstToken, true);
        const expectedReverseRate = await self.oldOffchainOracle.getRate(srcToken, dstToken, true);
        const actualReverseRate = await self.newOffchainOracle.getRate(srcToken, dstToken, true);
        assertRoughlyEquals(actualRate.toString(), expectedRate.toString(), 3);
        assertRoughlyEquals(actualReverseRate.toString(), expectedReverseRate.toString(), 3);
    }
});
