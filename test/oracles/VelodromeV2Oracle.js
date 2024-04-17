const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { network } = require('hardhat');
const { deployContract } = require('@1inch/solidity-utils');
const { resetHardhatNetworkFork } = require('@1inch/solidity-utils/hardhat-setup');
const {
    tokens,
    deployParams: { VelodromeV2, UniswapV3 },
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
        const velodromeV2Oracle = await deployContract('SolidlyOracle', [VelodromeV2.factory, VelodromeV2.initcodeHash]);
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
