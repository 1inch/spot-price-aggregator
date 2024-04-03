const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { network } = require('hardhat');
const { deployContract } = require('@1inch/solidity-utils');
const { resetHardhatNetworkFork } = require('@1inch/solidity-utils/hardhat-setup');
const {
    tokens,
    deployParams: { UniswapV3, Slipstream },
    defaultValues: { thresholdFilter },
    testRate,
    measureGas,
} = require('../helpers.js');

describe('SlipstreamOracle', function () {
    before(async function () {
        await resetHardhatNetworkFork(network, 'optimistic');
    });

    after(async function () {
        await resetHardhatNetworkFork(network, 'mainnet');
    });

    async function initContracts () {
        const uniswapV3Oracle = await deployContract('UniswapV3LikeOracle', [UniswapV3.factory, UniswapV3.initcodeHash, UniswapV3.fees]);
        const slipstreamOracle = await deployContract('SlipstreamOracle', [Slipstream.factory, Slipstream.implementation, Slipstream.tickSpacings]);
        return { uniswapV3Oracle, slipstreamOracle };
    }

    it('USDC -> WETH', async function () {
        const { uniswapV3Oracle, slipstreamOracle } = await loadFixture(initContracts);
        await testRate(tokens.optimistic.USDC, tokens.optimistic.WETH, tokens.NONE, uniswapV3Oracle, slipstreamOracle);
    });

    it('WETH -> USDC', async function () {
        const { uniswapV3Oracle, slipstreamOracle } = await loadFixture(initContracts);
        await testRate(tokens.optimistic.WETH, tokens.optimistic.USDC, tokens.NONE, uniswapV3Oracle, slipstreamOracle);
    });

    it('OP -> WETH', async function () {
        const { uniswapV3Oracle, slipstreamOracle } = await loadFixture(initContracts);
        await testRate(tokens.optimistic.OP, tokens.optimistic.WETH, tokens.NONE, uniswapV3Oracle, slipstreamOracle);
    });

    it('WETH -> OP', async function () {
        const { uniswapV3Oracle, slipstreamOracle } = await loadFixture(initContracts);
        await testRate(tokens.optimistic.WETH, tokens.optimistic.OP, tokens.NONE, uniswapV3Oracle, slipstreamOracle);
    });

    it('WETH -> USDC -> DAI', async function () {
        const { uniswapV3Oracle, slipstreamOracle } = await loadFixture(initContracts);
        await testRate(tokens.optimistic.WETH, tokens.optimistic.DAI, tokens.optimistic.USDC, uniswapV3Oracle, slipstreamOracle);
    });

    it('DAI -> USDC -> WETH', async function () {
        const { uniswapV3Oracle, slipstreamOracle } = await loadFixture(initContracts);
        await testRate(tokens.optimistic.DAI, tokens.optimistic.WETH, tokens.optimistic.USDC, uniswapV3Oracle, slipstreamOracle);
    });

    describe('Measure gas', function () {
        it('WETH -> USDC', async function () {
            const { uniswapV3Oracle, slipstreamOracle } = await loadFixture(initContracts);
            await measureGas(
                await slipstreamOracle.getFunction('getRate').send(tokens.optimistic.WETH, tokens.optimistic.USDC, tokens.NONE, thresholdFilter),
                'SlipstreamOracle WETH -> USDC',
            );
            await measureGas(
                await uniswapV3Oracle.getFunction('getRate').send(tokens.optimistic.WETH, tokens.optimistic.USDC, tokens.NONE, thresholdFilter),
                'UniswapV3Oracle WETH -> USDC',
            );
        });

        it('USDC -> WETH', async function () {
            const { uniswapV3Oracle, slipstreamOracle } = await loadFixture(initContracts);
            await measureGas(
                await slipstreamOracle.getFunction('getRate').send(tokens.optimistic.USDC, tokens.optimistic.WETH, tokens.NONE, thresholdFilter),
                'SlipstreamOracle USDC -> WETH',
            );
            await measureGas(
                await uniswapV3Oracle.getFunction('getRate').send(tokens.optimistic.USDC, tokens.optimistic.WETH, tokens.NONE, thresholdFilter),
                'UniswapV3Oracle USDC -> WETH',
            );
        });

        it('WETH -> OP -> USDC', async function () {
            const { uniswapV3Oracle, slipstreamOracle } = await loadFixture(initContracts);
            await measureGas(
                await slipstreamOracle.getFunction('getRate').send(tokens.optimistic.WETH, tokens.optimistic.USDC, tokens.optimistic.OP, thresholdFilter),
                'SlipstreamOracle WETH -> OP -> USDC',
            );
            await measureGas(
                await uniswapV3Oracle.getFunction('getRate').send(tokens.optimistic.WETH, tokens.optimistic.USDC, tokens.optimistic.OP, thresholdFilter),
                'UniswapV3Oracle WETH -> OP -> USDC',
            );
        });
    });
});
