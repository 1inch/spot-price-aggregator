const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { expect, assertRoughlyEqualValues, deployContract } = require('@1inch/solidity-utils');
const { tokens } = require('./helpers.js');

const dodoZoo = '0x3A97247DF274a17C59A3bd12735ea3FcDFb49950';
const uniswapV3 = {
    factory: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
    initcodeHash: '0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54',
    fees: [100, 500, 3000, 10000],
};

describe('DodoOracle', function () {
    async function initContracts () {
        const dodoOracle = await deployContract('DodoOracle', [dodoZoo]);
        const uniswapV3Oracle = await deployContract('UniswapV3LikeOracle', [uniswapV3.factory, uniswapV3.initcodeHash, uniswapV3.fees]);
        return { dodoOracle, uniswapV3Oracle };
    }

    it('should revert with amount of pools error', async function () {
        const { dodoOracle } = await loadFixture(initContracts);
        await expect(
            dodoOracle.getRate(tokens.USDT, tokens['1INCH'], tokens.NONE),
        ).to.be.revertedWithCustomError(dodoOracle, 'PoolNotFound');
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
