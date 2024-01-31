const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { assertRoughlyEqualValues, deployContract } = require('@1inch/solidity-utils');
const {
    tokens,
    deployParams: { VelodromeV2, UniswapV3 },
    defaultValues: { thresholdFilter },
    resetHardhatNetworkFork,
} = require('../helpers.js');

describe('VelodromeV2Oracle', function () {
    before(async function () {
        await resetHardhatNetworkFork('optimistic');
    });

    after(async function () {
        await resetHardhatNetworkFork('mainnet');
    });

    async function initContracts () {
        const velodromeV2Oracle = await deployContract('VelodromeV2Oracle', [VelodromeV2.router, VelodromeV2.registry]);
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

    const testRate = async function (srcToken, dstToken, connector, velodromeV2Oracle, uniswapV3Oracle) {
        const velodromeV2Result = await velodromeV2Oracle.getRate(srcToken, dstToken, connector, thresholdFilter);
        const v3Result = await uniswapV3Oracle.getRate(srcToken, dstToken, connector, thresholdFilter);
        assertRoughlyEqualValues(v3Result.rate, velodromeV2Result.rate, 0.05);
    };

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

        async function measureGas (tx, comment) {
            const receipt = await tx.wait();
            console.log('gasUsed', comment, receipt.gasUsed.toString());
        }
    });
});
