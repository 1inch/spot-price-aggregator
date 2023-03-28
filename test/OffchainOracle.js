const { ethers } = require('hardhat');
const { expect, ether, assertRoughlyEqualValues } = require('@1inch/solidity-utils');
const { tokens, assertRoughlyEquals } = require('./helpers.js');

const uniswapV2Factory = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f';
const initcodeHash = '0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f';
const oneInchLP1 = '0xbAF9A5d4b0052359326A6CDAb54BABAa3a3A9643';
const ADAIV2 = '0x028171bCA77440897B824Ca71D1c56caC55b68A3';

describe('OffchainOracle', function () {
    before(async function () {
        this.tresholdFilter = 10;

        const UniswapV2LikeOracle = await ethers.getContractFactory('UniswapV2LikeOracle');
        const UniswapOracle = await ethers.getContractFactory('UniswapOracle');
        const MooniswapOracle = await ethers.getContractFactory('MooniswapOracle');
        const BaseCoinWrapper = await ethers.getContractFactory('BaseCoinWrapper');
        const AaveWrapperV1 = await ethers.getContractFactory('AaveWrapperV1');
        const AaveWrapperV2 = await ethers.getContractFactory('AaveWrapperV2');
        const MultiWrapper = await ethers.getContractFactory('MultiWrapper');

        this.uniswapV2LikeOracle = await UniswapV2LikeOracle.deploy(uniswapV2Factory, initcodeHash);
        await this.uniswapV2LikeOracle.deployed();
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
    });

    describe('built-in connectors', function () {
        before(async function () {
            const OffchainOracle = await ethers.getContractFactory('OffchainOracle');
            this.offchainOracle = await OffchainOracle.deploy(
                this.multiWrapper.address,
                [
                    this.uniswapV2LikeOracle.address,
                    this.uniswapOracle.address,
                    this.mooniswapOracle.address,
                ],
                ['0', '1', '2'],
                [
                    tokens.NONE,
                    tokens.ETH,
                    tokens.WETH,
                    tokens.USDC,
                ],
                tokens.WETH,
            );
            await this.offchainOracle.deployed();
            this.expensiveOffachinOracle = await OffchainOracle.deploy(
                this.multiWrapper.address,
                [
                    this.uniswapV2LikeOracle.address,
                    this.uniswapOracle.address,
                    this.mooniswapOracle.address,
                ],
                ['2', '2', '2'],
                [
                    ...Object.values(tokens).slice(0, 10),
                ],
                tokens.WETH,
            );
            await this.expensiveOffachinOracle.deployed();
            const GasEstimator = await ethers.getContractFactory('GasEstimator');
            this.gasEstimator = await GasEstimator.deploy();
            await this.gasEstimator.deployed();
        });

        it('weth -> dai', async function () {
            const rate = await this.offchainOracle.getRate(tokens.WETH, tokens.DAI, true, this.tresholdFilter);
            expect(rate).to.gt(ether('1000'));
        });

        it('eth -> dai', async function () {
            const rate = await this.offchainOracle.getRate(tokens.ETH, tokens.DAI, true, this.tresholdFilter);
            expect(rate).to.gt(ether('1000'));
        });

        it('usdc -> dai', async function () {
            const rate = await this.offchainOracle.getRate(tokens.USDC, tokens.DAI, true, this.tresholdFilter);
            expect(rate).to.gt(ether('980000000000'));
        });

        it('dai -> adai', async function () {
            const rate = await this.offchainOracle.getRate(tokens.DAI, ADAIV2, true, this.tresholdFilter);
            expect(rate).to.equal(ether('1'));
        });

        it('getRate(dai -> link)_GasCheck', async function () {
            const result = await this.gasEstimator.gasCost(this.expensiveOffachinOracle.address,
                this.expensiveOffachinOracle.interface.encodeFunctionData('getRate', [tokens.DAI, tokens.LINK, true, this.tresholdFilter]));
            assertRoughlyEquals(result.gasUsed, '864444', 3);
        });

        it('getRateToEth(dai)_ShouldHaveCorrectRate', async function () {
            const expectedRate = await this.offchainOracle.getRate(tokens.DAI, tokens.WETH, true, this.tresholdFilter);
            const actualRate = await this.offchainOracle.getRateToEth(tokens.DAI, true, this.tresholdFilter);
            assertRoughlyEquals(expectedRate, actualRate, 3);
        });

        it('getRateToEth(dai)_GasCheck', async function () {
            const result = await this.gasEstimator.gasCost(this.expensiveOffachinOracle.address,
                this.expensiveOffachinOracle.interface.encodeFunctionData('getRateToEth', [tokens.DAI, true, this.tresholdFilter]));
            assertRoughlyEquals(result.gasUsed, '1447539', 3);
        });

        it('getRateDirect(dai -> link)_ShouldHaveCorrectRate', async function () {
            const expectedRate = await this.offchainOracle.getRate(tokens.DAI, tokens.LINK, true, this.tresholdFilter);
            const actualRate = await this.offchainOracle.getRate(tokens.DAI, tokens.LINK, false, this.tresholdFilter);
            assertRoughlyEquals(expectedRate, actualRate, 3);
        });

        it('getRateDirect(dai -> link)_GasCheck', async function () {
            const result = await this.gasEstimator.gasCost(this.expensiveOffachinOracle.address,
                this.expensiveOffachinOracle.interface.encodeFunctionData('getRate', [tokens.DAI, tokens.LINK, false, this.tresholdFilter]));
            assertRoughlyEquals(result.gasUsed, '382698', 2);
        });
    });

    describe('customConnectors', function () {
        before(async function () {
            this.connectors = [
                tokens.ETH,
                tokens.WETH,
                tokens.USDC,
            ];
            const OffchainOracle = await ethers.getContractFactory('OffchainOracle');
            this.offchainOracle = await OffchainOracle.deploy(
                this.multiWrapper.address,
                [
                    this.uniswapV2LikeOracle.address,
                    this.uniswapOracle.address,
                ],
                ['0', '1'],
                [
                    tokens.NONE,
                    ...this.connectors,
                ],
                tokens.WETH,
            );
            await this.offchainOracle.deployed();
            this.offchainOracleWithoutConnectors = await OffchainOracle.deploy(
                this.multiWrapper.address,
                [
                    this.uniswapV2LikeOracle.address,
                    this.uniswapOracle.address,
                ],
                ['0', '1'],
                [
                    tokens.NONE,
                ],
                tokens.WETH,
            );
            await this.offchainOracleWithoutConnectors.deployed();
        });

        it('weth -> dai', async function () {
            const rateWithCustomConnector = await this.offchainOracleWithoutConnectors.getRateWithCustomConnectors(tokens.WETH, tokens.DAI, true, this.connectors, this.tresholdFilter);
            const rate = await this.offchainOracle.getRate(tokens.WETH, tokens.DAI, true, this.tresholdFilter);
            expect(rateWithCustomConnector).to.gt(ether('1000'));
            assertRoughlyEqualValues(rateWithCustomConnector.toBigInt(), rate.toBigInt(), 1e-18);
        });

        it('eth -> dai', async function () {
            const rateWithCustomConnector = await this.offchainOracleWithoutConnectors.getRateWithCustomConnectors(tokens.ETH, tokens.DAI, true, this.connectors, this.tresholdFilter);
            const rate = await this.offchainOracle.getRate(tokens.ETH, tokens.DAI, true, this.tresholdFilter);
            expect(rateWithCustomConnector).to.gt(ether('1000'));
            assertRoughlyEqualValues(rateWithCustomConnector.toBigInt(), rate.toBigInt(), 1e-18);
        });

        it('usdc -> dai', async function () {
            const rateWithCustomConnector = await this.offchainOracleWithoutConnectors.getRateWithCustomConnectors(tokens.USDC, tokens.DAI, true, this.connectors, this.tresholdFilter);
            const rate = await this.offchainOracle.getRate(tokens.USDC, tokens.DAI, true, this.tresholdFilter);
            expect(rateWithCustomConnector).to.gt(ether('980000000000'));
            assertRoughlyEqualValues(rateWithCustomConnector.toBigInt(), rate.toBigInt(), 1e-18);
        });

        it('dai -> adai', async function () {
            const rateWithCustomConnector = await this.offchainOracleWithoutConnectors.getRateWithCustomConnectors(tokens.DAI, ADAIV2, true, this.connectors, this.tresholdFilter);
            const rate = await this.offchainOracle.getRate(tokens.DAI, ADAIV2, true, this.tresholdFilter);
            expect(rateWithCustomConnector).to.equal(ether('1'));
            assertRoughlyEqualValues(rateWithCustomConnector.toBigInt(), rate.toBigInt(), 1e-18);
        });
    });
});
