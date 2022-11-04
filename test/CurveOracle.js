const { tokens, assertRoughlyEqualValues } = require('./helpers.js');
const { ethers } = require('hardhat');

const uniswapV2Factory = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f';
const initcodeHash = '0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f';
const oneInchLP1 = '0xbAF9A5d4b0052359326A6CDAb54BABAa3a3A9643';
const curveRegistry = '0x0000000022D53366457F9d5E68Ec105046FC4383';

describe('CurveOracle', async function () {
    before(async function () {
        const UniswapV2LikeOracle = await ethers.getContractFactory('UniswapV2LikeOracle');
        const CurveOracle = await ethers.getContractFactory('CurveOracle');
        this.curveOracle = await CurveOracle.deploy(curveRegistry);
        await this.curveOracle.deployed();
        this.uniswapV2LikeOracle = await UniswapV2LikeOracle.deploy(uniswapV2Factory, initcodeHash);
        await this.uniswapV2LikeOracle.deployed();
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
        const CurveOracle = await ethers.getContractFactory('CurveOracle');
        const UniswapOracle = await ethers.getContractFactory('UniswapOracle');
        const UniswapV2LikeOracle = await ethers.getContractFactory('UniswapV2LikeOracle');
        const MooniswapOracle = await ethers.getContractFactory('MooniswapOracle');
        const BaseCoinWrapper = await ethers.getContractFactory('BaseCoinWrapper');
        const AaveWrapperV1 = await ethers.getContractFactory('AaveWrapperV1');
        const AaveWrapperV2 = await ethers.getContractFactory('AaveWrapperV2');
        const MultiWrapper = await ethers.getContractFactory('MultiWrapper');
        const OffchainOracle = await ethers.getContractFactory('OffchainOracle');

        this.uniswapV2LikeOracle = await UniswapV2LikeOracle.deploy(uniswapV2Factory, initcodeHash);
        await this.uniswapV2LikeOracle.deployed();
        this.curveOracle = await CurveOracle.deploy(curveRegistry);
        await this.curveOracle.deployed();
        this.uniswapOracle = await UniswapOracle.deploy('0xc0a47dFe034B400B47bDaD5FecDa2621de6c4d95');
        await this.uniswapOracle.deployed();
        this.mooniswapOracle = await MooniswapOracle.deploy(oneInchLP1);
        await this.mooniswapOracle.deployed();

        this.wethWrapper = await BaseCoinWrapper.deploy(tokens.WETH);
        await this.wethWrapper.deployed();
        this.aaveWrapperV1 = await AaveWrapperV1.deploy();
        await this.aaveWrapperV1.deployed();
        this.aaveWrapperV2 = await AaveWrapperV2.deploy('0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9');
        await this.aaveWrapperV2.deployed();
        await this.aaveWrapperV1.addMarkets([tokens.DAI]);
        await this.aaveWrapperV2.addMarkets([tokens.DAI]);
        this.multiWrapper = await MultiWrapper.deploy(
            [
                this.wethWrapper.address,
                this.aaveWrapperV1.address,
                this.aaveWrapperV2.address,
            ],
        );
        await this.multiWrapper.deployed();

        this.oldOffchainOracle = await OffchainOracle.deploy(
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
        await this.oldOffchainOracle.deployed();

        this.newOffchainOracle = await OffchainOracle.deploy(
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
        await this.newOffchainOracle.deployed();
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
