const { network } = require('hardhat');
const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { deployContract, assertRoughlyEqualValues } = require('@1inch/solidity-utils');
const { resetHardhatNetworkFork } = require('@1inch/solidity-utils/hardhat-setup');
const {
    tokens,
    deployParams: { VelocimieterV2, UniswapV3Base },
    defaultValues: { thresholdFilter },
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

        it('weth -> dai', async function () {
            const { velocimieterV2Oracle, uniswapV3Oracle } = await loadFixture(initContracts);
            await testRate(tokens.base.WETH, tokens.base.DAI, tokens.NONE, velocimieterV2Oracle, uniswapV3Oracle);
        });

        const testRate = async function (srcToken, dstToken, connector, velodromeV2Oracle, uniswapV3Oracle) {
            const velodromeV2Result = await velodromeV2Oracle.getRate(srcToken, dstToken, connector, thresholdFilter);
            const v3Result = await uniswapV3Oracle.getRate(srcToken, dstToken, connector, thresholdFilter);
            assertRoughlyEqualValues(v3Result.rate, velodromeV2Result.rate, 0.05);
        };
    });
});
