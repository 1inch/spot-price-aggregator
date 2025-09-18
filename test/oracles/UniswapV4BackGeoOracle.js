const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { deployContract } = require('@1inch/solidity-utils');
const {
    tokens,
    deployParams: { UniswapV2, UniswapV4 },
    testRate,
} = require('../helpers.js');

describe('UniswapV4BackGeoOracle', function () {
    async function initContracts () {
        const uniswapV2LikeOracle = await deployContract('UniswapV2LikeOracle', [UniswapV2.factory, UniswapV2.initcodeHash]);
        const uniswapV4BackGeoOracle = await deployContract('UniswapV4BackGeoOracle', [UniswapV4.stateView, UniswapV4.fees, UniswapV4.tickSpacings]);
        return { uniswapV2LikeOracle, uniswapV4BackGeoOracle };
    }

    describe('UniswapV4', function () {
        it('USDC -> USDT', async function () {
            const { uniswapV2LikeOracle, uniswapV4BackGeoOracle } = await loadFixture(initContracts);
            await testRate(tokens.USDC, tokens.USDT, tokens.NONE, uniswapV2LikeOracle, uniswapV4BackGeoOracle);
        });

        it('USDT -> USDC', async function () {
            const { uniswapV2LikeOracle, uniswapV4BackGeoOracle } = await loadFixture(initContracts);
            await testRate(tokens.USDT, tokens.USDC, tokens.NONE, uniswapV2LikeOracle, uniswapV4BackGeoOracle);
        });

        it('USDC -> WETH', async function () {
            const { uniswapV2LikeOracle, uniswapV4BackGeoOracle } = await loadFixture(initContracts);
            await testRate(tokens.USDC, tokens.WETH, tokens.NONE, uniswapV2LikeOracle, uniswapV4BackGeoOracle);
        });

        it('WETH -> USDC', async function () {
            const { uniswapV2LikeOracle, uniswapV4BackGeoOracle } = await loadFixture(initContracts);
            await testRate(tokens.WETH, tokens.USDC, tokens.NONE, uniswapV2LikeOracle, uniswapV4BackGeoOracle);
        });
    });
});