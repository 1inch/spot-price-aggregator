const { network } = require('hardhat');
const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { deployContract } = require('@1inch/solidity-utils');
const { resetHardhatNetworkFork } = require('@1inch/solidity-utils/hardhat-setup');
const {
    tokens,
    deployParams: { VelocimieterV2, UniswapV3Base },
    testRate,
} = require('../helpers.js');

describe('SolidlyOracle', function () {
    describe('VelocimieterV2', function () {
        before(async function () {
            await resetHardhatNetworkFork(network, 'base');
        });

        after(async function () {
            await resetHardhatNetworkFork(network, 'mainnet');
        });

        async function initContracts () {
            const velocimieterV2Oracle = await deployContract('SolidlyOracle', [VelocimieterV2.factory, VelocimieterV2.initcodeHash]);
            const uniswapV3Oracle = await deployContract('UniswapV3LikeOracle', [UniswapV3Base.factory, UniswapV3Base.initcodeHash, UniswapV3Base.fees]);
            return { velocimieterV2Oracle, uniswapV3Oracle };
        }

        it('WETH -> USDC', async function () {
            const { velocimieterV2Oracle, uniswapV3Oracle } = await loadFixture(initContracts);
            await testRate(tokens.base.WETH, tokens.base.USDC, tokens.NONE, velocimieterV2Oracle, uniswapV3Oracle);
        });

        it('USDC -> WETH', async function () {
            const { velocimieterV2Oracle, uniswapV3Oracle } = await loadFixture(initContracts);
            await testRate(tokens.base.USDC, tokens.base.WETH, tokens.NONE, velocimieterV2Oracle, uniswapV3Oracle);
        });

        it('WETH -> DAI', async function () {
            const { velocimieterV2Oracle, uniswapV3Oracle } = await loadFixture(initContracts);
            await testRate(tokens.base.WETH, tokens.base.DAI, tokens.NONE, velocimieterV2Oracle, uniswapV3Oracle);
        });

        it('DAI -> WETH', async function () {
            const { velocimieterV2Oracle, uniswapV3Oracle } = await loadFixture(initContracts);
            await testRate(tokens.base.DAI, tokens.base.WETH, tokens.NONE, velocimieterV2Oracle, uniswapV3Oracle);
        });
    });
});
