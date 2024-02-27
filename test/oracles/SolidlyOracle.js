const { network } = require('hardhat');
const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { deployContract } = require('@1inch/solidity-utils');
const { resetHardhatNetworkFork } = require('@1inch/solidity-utils/hardhat-setup');
const {
    tokens,
    deployParams: { VelocimeterV2, UniswapV3Base },
    testRate,
} = require('../helpers.js');

describe('SolidlyOracle', function () {
    describe('VelocimeterV2', function () {
        before(async function () {
            await resetHardhatNetworkFork(network, 'base');
        });

        after(async function () {
            await resetHardhatNetworkFork(network, 'mainnet');
        });

        async function initContracts () {
            const velocimeterV2Oracle = await deployContract('SolidlyOracle', [VelocimeterV2.factory, VelocimeterV2.initcodeHash]);
            const uniswapV3Oracle = await deployContract('UniswapV3LikeOracle', [UniswapV3Base.factory, UniswapV3Base.initcodeHash, UniswapV3Base.fees]);
            return { velocimeterV2Oracle, uniswapV3Oracle };
        }

        it('WETH -> axlUSDC', async function () {
            const { velocimeterV2Oracle, uniswapV3Oracle } = await loadFixture(initContracts);
            await testRate(tokens.base.WETH, tokens.base.axlUSDC, tokens.NONE, velocimeterV2Oracle, uniswapV3Oracle);
        });

        it('axlUSDC -> WETH', async function () {
            const { velocimeterV2Oracle, uniswapV3Oracle } = await loadFixture(initContracts);
            await testRate(tokens.base.axlUSDC, tokens.base.WETH, tokens.NONE, velocimeterV2Oracle, uniswapV3Oracle);
        });

        it('WETH -> DAI', async function () {
            const { velocimeterV2Oracle, uniswapV3Oracle } = await loadFixture(initContracts);
            await testRate(tokens.base.WETH, tokens.base.DAI, tokens.NONE, velocimeterV2Oracle, uniswapV3Oracle, 0.1);
        });

        it('DAI -> WETH', async function () {
            const { velocimeterV2Oracle, uniswapV3Oracle } = await loadFixture(initContracts);
            await testRate(tokens.base.DAI, tokens.base.WETH, tokens.NONE, velocimeterV2Oracle, uniswapV3Oracle, 0.1);
        });
    });
});
