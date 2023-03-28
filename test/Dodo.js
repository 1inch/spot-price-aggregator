const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { expect } = require('@1inch/solidity-utils');
const { tokens, assertRoughlyEqualValues, deployContract } = require('./helpers.js');

const dodoZoo = '0x3A97247DF274a17C59A3bd12735ea3FcDFb49950';

describe('DodoOracle', function () {
    async function initContracts () {
        const dodoOracle = await deployContract('DodoOracle', [dodoZoo]);
        const uniswapV3Oracle = await deployContract('UniswapV3Oracle');
        return { dodoOracle, uniswapV3Oracle };
    }

    it('should revert with amount of pools error', async function () {
        const { dodoOracle } = await loadFixture(initContracts);
        await expect(
            dodoOracle.getRate(tokens.USDT, tokens['1INCH'], tokens.NONE),
        ).to.be.revertedWith('DO: Dodo not found');
    });

    it('WETH -> USDC', async function () {
        const { dodoOracle, uniswapV3Oracle } = await loadFixture(initContracts);
        await testRate(tokens.WETH, tokens.USDC, tokens.NONE, dodoOracle, uniswapV3Oracle);
    });

    it('USDC -> WETH', async function () {
        const { dodoOracle, uniswapV3Oracle } = await loadFixture(initContracts);
        await testRate(tokens.USDC, tokens.WETH, tokens.NONE, dodoOracle, uniswapV3Oracle);
    });

    it('WETH -> USDC -> WBTC', async function () {
        const { dodoOracle, uniswapV3Oracle } = await loadFixture(initContracts);
        await testRate(tokens.WETH, tokens.WBTC, tokens.USDC, dodoOracle, uniswapV3Oracle);
    });

    it('WBTC -> USDC -> WETH', async function () {
        const { dodoOracle, uniswapV3Oracle } = await loadFixture(initContracts);
        await testRate(tokens.WBTC, tokens.WETH, tokens.USDC, dodoOracle, uniswapV3Oracle);
    });

    const testRate = async function (srcToken, dstToken, connector, dodoOracle, uniswapV3Oracle) {
        const dodoResult = await dodoOracle.getRate(srcToken, dstToken, connector);
        const v3Result = await uniswapV3Oracle.getRate(srcToken, dstToken, connector);
        assertRoughlyEqualValues(v3Result.rate.toString(), dodoResult.rate.toString(), 0.05);
    };
});
