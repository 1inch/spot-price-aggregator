const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { network } = require('hardhat');
const { deployContract } = require('@1inch/solidity-utils');
const { resetHardhatNetworkFork } = require('@1inch/solidity-utils/hardhat-setup');
const {
    tokens,
    deployParams: { QuickSwapV3, UniswapV3Polygon },
    testRate,
} = require('../helpers.js');

describe('AlgebraOracle', function () {
    before(async function () {
        await resetHardhatNetworkFork(network, 'matic');
    });

    after(async function () {
        await resetHardhatNetworkFork(network, 'mainnet');
    });

    async function initContracts () {
        const algebraOracle = await deployContract('AlgebraOracle', [QuickSwapV3.factory, QuickSwapV3.initcodeHash]);
        const uniswapV3Oracle = await deployContract('UniswapV3LikeOracle', [UniswapV3Polygon.factory, UniswapV3Polygon.initcodeHash, UniswapV3Polygon.fees]);
        return { algebraOracle, uniswapV3Oracle };
    }

    describe('QuickSwapV3', function () {
        it('USDC -> WETH', async function () {
            const { algebraOracle, uniswapV3Oracle } = await loadFixture(initContracts);
            await testRate(tokens.matic.USDC, tokens.matic.WETH, tokens.NONE, algebraOracle, uniswapV3Oracle);
        });

        it('WETH -> USDC', async function () {
            const { algebraOracle, uniswapV3Oracle } = await loadFixture(initContracts);
            await testRate(tokens.matic.WETH, tokens.matic.USDC, tokens.NONE, algebraOracle, uniswapV3Oracle);
        });

        it('WETH -> WMATIC', async function () {
            const { algebraOracle, uniswapV3Oracle } = await loadFixture(initContracts);
            await testRate(tokens.matic.WETH, tokens.matic.WMATIC, tokens.NONE, algebraOracle, uniswapV3Oracle);
        });

        it('WMATIC -> WETH', async function () {
            const { algebraOracle, uniswapV3Oracle } = await loadFixture(initContracts);
            await testRate(tokens.matic.WMATIC, tokens.matic.WETH, tokens.NONE, algebraOracle, uniswapV3Oracle);
        });

        it('WMATIC -> USDC -> WETH', async function () {
            const { algebraOracle, uniswapV3Oracle } = await loadFixture(initContracts);
            await testRate(tokens.matic.WMATIC, tokens.matic.WETH, tokens.matic.USDC, algebraOracle, uniswapV3Oracle);
        });

        it('WETH -> USDC -> WMATIC', async function () {
            const { algebraOracle, uniswapV3Oracle } = await loadFixture(initContracts);
            await testRate(tokens.matic.WETH, tokens.matic.WMATIC, tokens.matic.USDC, algebraOracle, uniswapV3Oracle);
        });
    });
});
