const hre = require('hardhat');
const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { expect, ether, assertRoughlyEqualValues, deployContract } = require('@1inch/solidity-utils');
const { tokens, deployParams: { AaveWrapperV2, Uniswap, UniswapV2 } } = require('./helpers.js');

describe('OffchainOracle', function () {
    async function initContracts () {
        const thresholdFilter = 10;

        const uniswapV2LikeOracle = await deployContract('UniswapV2LikeOracle', [UniswapV2.factory, UniswapV2.initcodeHash]);
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

        return {
            thresholdFilter,
            uniswapV2LikeOracle,
            uniswapOracle,
            mooniswapOracle,
            multiWrapper,
        };
    }

    describe('built-in connectors', function () {
        async function initContractsAndOffchainOracle () {
            const { thresholdFilter, uniswapV2LikeOracle, uniswapOracle, mooniswapOracle, multiWrapper } = await initContracts();

            const offchainOracle = await deployContract('OffchainOracle', [
                multiWrapper.address,
                [
                    uniswapV2LikeOracle.address,
                    uniswapOracle.address,
                    mooniswapOracle.address,
                ],
                ['0', '1', '2'],
                [
                    tokens.NONE,
                    tokens.ETH,
                    tokens.WETH,
                    tokens.USDC,
                ],
                tokens.WETH,
            ]);

            const expensiveOffchainOracle = await deployContract('OffchainOracle', [
                multiWrapper.address,
                [
                    uniswapV2LikeOracle.address,
                    uniswapOracle.address,
                    mooniswapOracle.address,
                ],
                ['2', '2', '2'],
                [
                    ...Object.values(tokens).slice(0, 10),
                ],
                tokens.WETH,
            ]);

            const gasEstimator = await deployContract('GasEstimator');
            return { thresholdFilter, offchainOracle, expensiveOffchainOracle, gasEstimator };
        }

        it('weth -> dai', async function () {
            const { thresholdFilter, offchainOracle } = await loadFixture(initContractsAndOffchainOracle);
            const rate = await offchainOracle.getRateWithThreshold(tokens.WETH, tokens.DAI, true, thresholdFilter);
            expect(rate).to.gt(ether('1000'));
        });

        it('eth -> dai', async function () {
            const { thresholdFilter, offchainOracle } = await loadFixture(initContractsAndOffchainOracle);
            const rate = await offchainOracle.getRateWithThreshold(tokens.ETH, tokens.DAI, true, thresholdFilter);
            expect(rate).to.gt(ether('1000'));
        });

        it('usdc -> dai', async function () {
            const { thresholdFilter, offchainOracle } = await loadFixture(initContractsAndOffchainOracle);
            const rate = await offchainOracle.getRateWithThreshold(tokens.USDC, tokens.DAI, true, thresholdFilter);
            expect(rate).to.gt(ether('980000000000'));
        });

        it('dai -> adai', async function () {
            const { thresholdFilter, offchainOracle } = await loadFixture(initContractsAndOffchainOracle);
            const rate = await offchainOracle.getRateWithThreshold(tokens.DAI, tokens.aDAIV2, true, thresholdFilter);
            expect(rate).to.equal(ether('1'));
        });

        it('getRate(dai -> link)', async function () {
            if (hre.__SOLIDITY_COVERAGE_RUNNING) { this.skip(); }
            const { thresholdFilter, expensiveOffchainOracle, gasEstimator } = await loadFixture(initContractsAndOffchainOracle);
            const result = await gasEstimator.gasCost(
                expensiveOffchainOracle.address,
                expensiveOffchainOracle.interface.encodeFunctionData('getRateWithThreshold', [tokens.DAI, tokens.LINK, true, thresholdFilter]),
            );
            assertRoughlyEqualValues(result.gasUsed, '851124', 1e-2);
        });

        it('getRateToEth(dai)_ShouldHaveCorrectRate', async function () {
            const { thresholdFilter, offchainOracle } = await loadFixture(initContractsAndOffchainOracle);
            const expectedRate = await offchainOracle.getRateWithThreshold(tokens.DAI, tokens.WETH, true, thresholdFilter);
            const actualRate = await offchainOracle.getRateToEthWithThreshold(tokens.DAI, true, thresholdFilter);
            assertRoughlyEqualValues(expectedRate, actualRate, 1e-2);
        });

        it('getRateToEth(dai)', async function () {
            if (hre.__SOLIDITY_COVERAGE_RUNNING) { this.skip(); }
            const { thresholdFilter, expensiveOffchainOracle, gasEstimator } = await loadFixture(initContractsAndOffchainOracle);
            const result = await gasEstimator.gasCost(
                expensiveOffchainOracle.address,
                expensiveOffchainOracle.interface.encodeFunctionData('getRateToEthWithThreshold', [tokens.DAI, true, thresholdFilter]),
            );
            assertRoughlyEqualValues(result.gasUsed, '1418435', 1e-2);
        });

        it('getRateDirect(dai -> link)_ShouldHaveCorrectRate', async function () {
            const { thresholdFilter, offchainOracle } = await loadFixture(initContractsAndOffchainOracle);
            const expectedRate = await offchainOracle.getRateWithThreshold(tokens.DAI, tokens.LINK, true, thresholdFilter);
            const actualRate = await offchainOracle.getRateWithThreshold(tokens.DAI, tokens.LINK, false, thresholdFilter);
            assertRoughlyEqualValues(expectedRate, actualRate, 1e-2);
        });

        it('getRateDirect(dai -> link)', async function () {
            if (hre.__SOLIDITY_COVERAGE_RUNNING) { this.skip(); }
            const { thresholdFilter, expensiveOffchainOracle, gasEstimator } = await loadFixture(initContractsAndOffchainOracle);
            const result = await gasEstimator.gasCost(
                expensiveOffchainOracle.address,
                expensiveOffchainOracle.interface.encodeFunctionData('getRateWithThreshold', [tokens.DAI, tokens.LINK, false, thresholdFilter]),
            );
            assertRoughlyEqualValues(result.gasUsed, '382698', 1e-1);
        });
    });

    describe('customConnectors', function () {
        async function initContractsAndOffchainOracle () {
            const { thresholdFilter, uniswapV2LikeOracle, uniswapOracle, multiWrapper } = await initContracts();

            const connectors = [
                tokens.ETH,
                tokens.WETH,
                tokens.USDC,
            ];
            const offchainOracle = await deployContract('OffchainOracle', [
                multiWrapper.address,
                [
                    uniswapV2LikeOracle.address,
                    uniswapOracle.address,
                ],
                ['0', '1'],
                [
                    tokens.NONE,
                    ...connectors,
                ],
                tokens.WETH,
            ]);

            const offchainOracleWithoutConnectors = await deployContract('OffchainOracle', [
                multiWrapper.address,
                [
                    uniswapV2LikeOracle.address,
                    uniswapOracle.address,
                ],
                ['0', '1'],
                [
                    tokens.NONE,
                ],
                tokens.WETH,
            ]);

            return { thresholdFilter, offchainOracle, offchainOracleWithoutConnectors, connectors };
        }

        it('weth -> dai', async function () {
            const { thresholdFilter, offchainOracle, offchainOracleWithoutConnectors, connectors } = await loadFixture(initContractsAndOffchainOracle);
            const rateWithCustomConnector = await offchainOracleWithoutConnectors.getRateWithCustomConnectors(tokens.WETH, tokens.DAI, true, connectors, thresholdFilter);
            const rate = await offchainOracle.getRateWithThreshold(tokens.WETH, tokens.DAI, true, thresholdFilter);
            expect(rateWithCustomConnector).to.gt(ether('1000'));
            assertRoughlyEqualValues(rateWithCustomConnector.toBigInt(), rate.toBigInt(), 1e-18);
        });

        it('eth -> dai', async function () {
            const { thresholdFilter, offchainOracle, offchainOracleWithoutConnectors, connectors } = await loadFixture(initContractsAndOffchainOracle);
            const rateWithCustomConnector = await offchainOracleWithoutConnectors.getRateWithCustomConnectors(tokens.ETH, tokens.DAI, true, connectors, thresholdFilter);
            const rate = await offchainOracle.getRateWithThreshold(tokens.ETH, tokens.DAI, true, thresholdFilter);
            expect(rateWithCustomConnector).to.gt(ether('1000'));
            assertRoughlyEqualValues(rateWithCustomConnector.toBigInt(), rate.toBigInt(), 1e-18);
        });

        it('usdc -> dai', async function () {
            const { thresholdFilter, offchainOracle, offchainOracleWithoutConnectors, connectors } = await loadFixture(initContractsAndOffchainOracle);
            const rateWithCustomConnector = await offchainOracleWithoutConnectors.getRateWithCustomConnectors(tokens.USDC, tokens.DAI, true, connectors, thresholdFilter);
            const rate = await offchainOracle.getRateWithThreshold(tokens.USDC, tokens.DAI, true, thresholdFilter);
            expect(rateWithCustomConnector).to.gt(ether('980000000000'));
            assertRoughlyEqualValues(rateWithCustomConnector.toBigInt(), rate.toBigInt(), 1e-18);
        });

        it('dai -> adai', async function () {
            const { thresholdFilter, offchainOracle, offchainOracleWithoutConnectors, connectors } = await loadFixture(initContractsAndOffchainOracle);
            const rateWithCustomConnector = await offchainOracleWithoutConnectors.getRateWithCustomConnectors(tokens.DAI, tokens.aDAIV2, true, connectors, thresholdFilter);
            const rate = await offchainOracle.getRateWithThreshold(tokens.DAI, tokens.aDAIV2, true, thresholdFilter);
            expect(rateWithCustomConnector).to.equal(ether('1'));
            assertRoughlyEqualValues(rateWithCustomConnector.toBigInt(), rate.toBigInt(), 1e-18);
        });
    });
});
