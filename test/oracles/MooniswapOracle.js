const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { deployContract } = require('@1inch/solidity-utils');
const {
    tokens,
    deployParams: { Mooniswap, UniswapV3 },
    testRate,
} = require('../helpers.js');

describe('MooniswapOracle', function () {
    async function initContracts () {
        const mooniswapOracle = await deployContract('MooniswapOracle', [Mooniswap.factory]);
        const uniswapV3Oracle = await deployContract('UniswapV3LikeOracle', [UniswapV3.factory, UniswapV3.initcodeHash, UniswapV3.fees]);
        return { mooniswapOracle, uniswapV3Oracle };
    }

    it('ETH -> DAI', async function () {
        const { mooniswapOracle, uniswapV3Oracle } = await loadFixture(initContracts);
        await testRate([tokens.ETH, tokens.WETH], tokens.DAI, tokens.NONE, mooniswapOracle, uniswapV3Oracle, 0.2);
    });

    it('DAI -> ETH', async function () {
        const { mooniswapOracle, uniswapV3Oracle } = await loadFixture(initContracts);
        await testRate(tokens.DAI, [tokens.ETH, tokens.WETH], tokens.NONE, mooniswapOracle, uniswapV3Oracle, 0.2);
    });

    it('ETH -> USDC', async function () {
        const { mooniswapOracle, uniswapV3Oracle } = await loadFixture(initContracts);
        await testRate([tokens.ETH, tokens.WETH], tokens.USDC, tokens.NONE, mooniswapOracle, uniswapV3Oracle, 0.2);
    });

    it('USDC -> 1INCH', async function () {
        const { mooniswapOracle, uniswapV3Oracle } = await loadFixture(initContracts);
        await testRate(tokens.USDC, tokens['1INCH'], tokens.NONE, mooniswapOracle, uniswapV3Oracle, 0.2);
    });

    it('ETH -> USDC -> 1INCH', async function () {
        const { mooniswapOracle, uniswapV3Oracle } = await loadFixture(initContracts);
        await testRate([tokens.ETH, tokens.WETH], tokens['1INCH'], tokens.USDC, mooniswapOracle, uniswapV3Oracle, 0.2);
    });
});
