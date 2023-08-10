const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { expect, assertRoughlyEqualValues, deployContract } = require('@1inch/solidity-utils');
const {
    tokens,
    deployParams: { KyberDmm, UniswapV3 },
    defaultValues: { thresholdFilter },
} = require('./helpers.js');

describe('KyberDmmOracle', function () {
    async function initContracts () {
        const kyberDmmOracle = await deployContract('KyberDmmOracle', [KyberDmm.factory]);
        const uniswapV3Oracle = await deployContract('UniswapV3LikeOracle', [UniswapV3.factory, UniswapV3.initcodeHash, UniswapV3.fees]);
        return { kyberDmmOracle, uniswapV3Oracle };
    }

    it('should revert with amount of pools error', async function () {
        const { kyberDmmOracle } = await loadFixture(initContracts);
        await expect(
            kyberDmmOracle.callStatic.getRate(tokens.USDT, tokens.EEE, tokens.NONE, thresholdFilter),
        ).to.be.revertedWithCustomError(kyberDmmOracle, 'PoolNotFound');
    });

    it('should revert with amount of pools with connector error', async function () {
        const { kyberDmmOracle } = await loadFixture(initContracts);
        await expect(
            kyberDmmOracle.callStatic.getRate(tokens.USDT, tokens.WETH, tokens.MKR, thresholdFilter),
        ).to.be.revertedWithCustomError(kyberDmmOracle, 'PoolWithConnectorNotFound');
    });

    it('USDC -> USDT', async function () {
        const { kyberDmmOracle, uniswapV3Oracle } = await loadFixture(initContracts);
        await testRate(tokens.USDC, tokens.USDT, tokens.NONE, kyberDmmOracle, uniswapV3Oracle);
    });

    it('USDT -> USDC', async function () {
        const { kyberDmmOracle, uniswapV3Oracle } = await loadFixture(initContracts);
        await testRate(tokens.USDT, tokens.USDC, tokens.NONE, kyberDmmOracle, uniswapV3Oracle);
    });

    it('WBTC -> WETH', async function () {
        const { kyberDmmOracle, uniswapV3Oracle } = await loadFixture(initContracts);
        await testRate(tokens.WBTC, tokens.WETH, tokens.NONE, kyberDmmOracle, uniswapV3Oracle);
    });

    it('WETH -> WBTC', async function () {
        const { kyberDmmOracle, uniswapV3Oracle } = await loadFixture(initContracts);
        await testRate(tokens.WETH, tokens.WBTC, tokens.NONE, kyberDmmOracle, uniswapV3Oracle);
    });

    it('USDC -> USDT -> WBTC', async function () {
        const { kyberDmmOracle, uniswapV3Oracle } = await loadFixture(initContracts);
        await testRate(tokens.USDC, tokens.WBTC, tokens.USDT, kyberDmmOracle, uniswapV3Oracle);
    });

    it('WBTC -> USDT -> USDC', async function () {
        const { kyberDmmOracle, uniswapV3Oracle } = await loadFixture(initContracts);
        await testRate(tokens.WBTC, tokens.USDC, tokens.USDT, kyberDmmOracle, uniswapV3Oracle);
    });

    async function testRate (srcToken, dstToken, connector, kyberDmmOracle, uniswapV3Oracle) {
        const kyberResult = await kyberDmmOracle.getRate(srcToken, dstToken, connector, thresholdFilter);
        const v3Result = await uniswapV3Oracle.getRate(srcToken, dstToken, connector, thresholdFilter);
        assertRoughlyEqualValues(v3Result.rate.toString(), kyberResult.rate.toString(), 0.05);
    }
});
