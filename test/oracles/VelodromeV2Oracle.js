const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { network, ethers } = require('hardhat');
const { deployContract } = require('@1inch/solidity-utils');
const { resetHardhatNetworkFork } = require('@1inch/solidity-utils/hardhat-setup');
const {
    tokens,
    deployParams: { Slipstream, VelodromeV2, UniswapV3 },
    defaultValues: { thresholdFilter },
    testRate,
    measureGas,
} = require('../helpers.js');

describe('VelodromeV2Oracle', function () {
    before(async function () {
        await resetHardhatNetworkFork(network, 'optimistic');
    });

    after(async function () {
        await resetHardhatNetworkFork(network, 'mainnet');
    });

    async function initContracts () {
        const velodromeV2Oracle = await deployContract('VelodromeV2Oracle', [VelodromeV2.router, VelodromeV2.registry, VelodromeV2.poolFactory, Slipstream.factory]);
        const uniswapV3Oracle = await deployContract('UniswapV3LikeOracle', [UniswapV3.factory, UniswapV3.initcodeHash, UniswapV3.fees]);
        return { velodromeV2Oracle, uniswapV3Oracle };
    }

    it('WETH -> USDC', async function () {
        const { velodromeV2Oracle, uniswapV3Oracle } = await loadFixture(initContracts);
        await testRate(tokens.optimistic.WETH, tokens.optimistic.USDC, tokens.NONE, velodromeV2Oracle, uniswapV3Oracle);
    });

    it('USDC -> WETH', async function () {
        const { velodromeV2Oracle, uniswapV3Oracle } = await loadFixture(initContracts);
        await testRate(tokens.optimistic.USDC, tokens.optimistic.WETH, tokens.NONE, velodromeV2Oracle, uniswapV3Oracle);
    });

    it('WETH -> OP -> USDC', async function () {
        const { velodromeV2Oracle, uniswapV3Oracle } = await loadFixture(initContracts);
        await testRate(tokens.optimistic.WETH, tokens.optimistic.USDC, tokens.optimistic.OP, velodromeV2Oracle, uniswapV3Oracle);
    });

    describe('Measure gas', function () {
        async function initContractsForOffchainOracle () {
            const { velodromeV2Oracle } = await loadFixture(initContracts);

            const [wallet] = await ethers.getSigners();
            const velodromeV2OraclePrevVersion = await ethers.getContractAt('VelodromeV2Oracle', '0x41674e58F339fE1caB03CA8DF095D46B998E6125');
            const multiWrapper = await deployContract('MultiWrapper', [[], wallet.address]);
            const offchainOracle = await deployContract('OffchainOracle', [
                multiWrapper.target,
                [velodromeV2OraclePrevVersion],
                ['0'],
                [tokens.NONE],
                tokens.optimistic.WETH,
                wallet.address,
            ]);
            const offchainOracleNew = await deployContract('OffchainOracle', [
                multiWrapper.target,
                [velodromeV2Oracle],
                ['0'],
                [tokens.NONE],
                tokens.optimistic.WETH,
                wallet.address,
            ]);
            return { offchainOracle, offchainOracleNew };
        }

        it('OffchainOracle with 1 connector', async function () {
            const { offchainOracle, offchainOracleNew } = await loadFixture(initContractsForOffchainOracle);
            await measureGas(
                await offchainOracle.getFunction('getRateWithThreshold').send(tokens.optimistic.WETH, tokens.optimistic.USDC, tokens.NONE, thresholdFilter),
                'offchainOracle (1 connector) WETH -> USDC',
            );
            await measureGas(
                await offchainOracleNew.getFunction('getRateWithThreshold').send(tokens.optimistic.WETH, tokens.optimistic.USDC, tokens.NONE, thresholdFilter),
                'offchainOracleNew (1 connector) WETH -> USDC',
            );
        });

        it('OffchainOracle with 2 connectors', async function () {
            const { offchainOracle, offchainOracleNew } = await loadFixture(initContractsForOffchainOracle);
            await offchainOracle.addConnector(tokens.optimistic.OP);
            await offchainOracleNew.addConnector(tokens.optimistic.OP);

            await measureGas(
                await offchainOracle.getFunction('getRateWithThreshold').send(tokens.optimistic.WETH, tokens.optimistic.USDC, tokens.NONE, thresholdFilter),
                'offchainOracle (2 connectors) WETH -> USDC',
            );
            await measureGas(
                await offchainOracleNew.getFunction('getRateWithThreshold').send(tokens.optimistic.WETH, tokens.optimistic.USDC, tokens.NONE, thresholdFilter),
                'offchainOracleNew (2 connector) WETH -> USDC',
            );
        });

        it('WETH -> USDC', async function () {
            const { velodromeV2Oracle, uniswapV3Oracle } = await loadFixture(initContracts);
            await measureGas(
                await velodromeV2Oracle.getFunction('getRate').send(tokens.optimistic.WETH, tokens.optimistic.USDC, tokens.NONE, thresholdFilter),
                'VelodromeV2Oracle WETH -> USDC',
            );
            await measureGas(
                await uniswapV3Oracle.getFunction('getRate').send(tokens.optimistic.WETH, tokens.optimistic.USDC, tokens.NONE, thresholdFilter),
                'UniswapV3Oracle WETH -> USDC',
            );
        });

        it('USDC -> WETH', async function () {
            const { velodromeV2Oracle, uniswapV3Oracle } = await loadFixture(initContracts);
            await measureGas(
                await velodromeV2Oracle.getFunction('getRate').send(tokens.optimistic.USDC, tokens.optimistic.WETH, tokens.NONE, thresholdFilter),
                'VelodromeV2Oracle USDC -> WETH',
            );
            await measureGas(
                await uniswapV3Oracle.getFunction('getRate').send(tokens.optimistic.USDC, tokens.optimistic.WETH, tokens.NONE, thresholdFilter),
                'UniswapV3Oracle USDC -> WETH',
            );
        });

        it('WETH -> OP -> USDC', async function () {
            const { velodromeV2Oracle, uniswapV3Oracle } = await loadFixture(initContracts);
            await measureGas(
                await velodromeV2Oracle.getFunction('getRate').send(tokens.optimistic.WETH, tokens.optimistic.USDC, tokens.optimistic.OP, thresholdFilter),
                'VelodromeV2Oracle WETH -> OP -> USDC',
            );
            await measureGas(
                await uniswapV3Oracle.getFunction('getRate').send(tokens.optimistic.WETH, tokens.optimistic.USDC, tokens.optimistic.OP, thresholdFilter),
                'UniswapV3Oracle WETH -> OP -> USDC',
            );
        });
    });
});
