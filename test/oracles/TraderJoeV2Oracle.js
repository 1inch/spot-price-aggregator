const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { network } = require('hardhat');
const { resetHardhatNetworkFork } = require('@1inch/solidity-utils/hardhat-setup');
const { expect, deployContract } = require('@1inch/solidity-utils');
const {
    tokens,
    deployParams: { TraderJoeV2, UniswapV3 },
    testRate,
} = require('../helpers.js');

describe('TraderJoeV2Oracle', function () {
    before(async function () {
        await resetHardhatNetworkFork(network, 'avax');
    });

    after(async function () {
        await resetHardhatNetworkFork(network, 'mainnet');
    });

    async function initContracts () {
        const traderJoeV2Oracle = await deployContract('TraderJoeV2Oracle', [TraderJoeV2.factory]);
        return { traderJoeV2Oracle };
    }

    it('should revert with amount of pools error', async function () {
        const { traderJoeV2Oracle } = await loadFixture(initContracts);
        await expect(
            testRate(tokens.avax.EURC, tokens.EEE, tokens.NONE, traderJoeV2Oracle),
        ).to.be.revertedWithCustomError(traderJoeV2Oracle, 'PoolNotFound');
    });

    it('should revert with amount of pools with connector error', async function () {
        const { traderJoeV2Oracle } = await loadFixture(initContracts);
        await expect(
            testRate(tokens.avax.EURC, tokens.avax.USDC, tokens.EEE, traderJoeV2Oracle),
        ).to.be.revertedWithCustomError(traderJoeV2Oracle, 'PoolWithConnectorNotFound');
    });

    it('EURC -> USDC', async function () {
        const { traderJoeV2Oracle } = await loadFixture(initContracts);
        await testRate(tokens.avax.EURC, tokens.avax.USDC, tokens.NONE, traderJoeV2Oracle, {
            getRate: async () => { return {rate: 1n} },
        });
    });

    // it('USDT -> USDC', async function () {
    //     const { kyberDmmOracle, uniswapV3Oracle } = await loadFixture(initContracts);
    //     await testRate(tokens.USDT, tokens.USDC, tokens.NONE, kyberDmmOracle, uniswapV3Oracle);
    // });

    // it('WBTC -> WETH', async function () {
    //     const { kyberDmmOracle, uniswapV3Oracle } = await loadFixture(initContracts);
    //     await testRate(tokens.WBTC, tokens.WETH, tokens.NONE, kyberDmmOracle, uniswapV3Oracle);
    // });

    // it('WETH -> WBTC', async function () {
    //     const { kyberDmmOracle, uniswapV3Oracle } = await loadFixture(initContracts);
    //     await testRate(tokens.WETH, tokens.WBTC, tokens.NONE, kyberDmmOracle, uniswapV3Oracle);
    // });

    // it('USDC -> USDT -> WBTC', async function () {
    //     const { kyberDmmOracle, uniswapV3Oracle } = await loadFixture(initContracts);
    //     await testRate(tokens.USDC, tokens.WBTC, tokens.USDT, kyberDmmOracle, uniswapV3Oracle);
    // });

    // it('WBTC -> USDT -> USDC', async function () {
    //     const { kyberDmmOracle, uniswapV3Oracle } = await loadFixture(initContracts);
    //     await testRate(tokens.WBTC, tokens.USDC, tokens.USDT, kyberDmmOracle, uniswapV3Oracle);
    // });
});
