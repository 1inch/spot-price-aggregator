const { ethers } = require('hardhat');
const { expect } = require('@1inch/solidity-utils');
const { tokens, assertRoughlyEqualValues } = require('./helpers.js');

const dodoZoo = '0x3A97247DF274a17C59A3bd12735ea3FcDFb49950';

describe('DodoOracle', function () {
    let dodoOracle;
    let uniswapV3Oracle;

    before(async function () {
        const DodoOracle = await ethers.getContractFactory('DodoOracle');
        const UniswapV3Oracle = await ethers.getContractFactory('UniswapV3Oracle');
        dodoOracle = await DodoOracle.deploy(dodoZoo);
        await dodoOracle.deployed();
        uniswapV3Oracle = await UniswapV3Oracle.deploy();
        await uniswapV3Oracle.deployed();
    });

    it('should revert with amount of pools error', async function () {
        await expect(
            dodoOracle.getRate(tokens.USDT, tokens['1INCH'], tokens.NONE),
        ).to.be.revertedWith('DO: Dodo not found');
    });

    it('WETH -> USDC', async function () {
        await testRate(tokens.WETH, tokens.USDC, tokens.NONE);
    });

    it('USDC -> WETH', async function () {
        await testRate(tokens.USDC, tokens.WETH, tokens.NONE);
    });

    it('WETH -> USDC -> WBTC', async function () {
        await testRate(tokens.WETH, tokens.WBTC, tokens.USDC);
    });

    it('WBTC -> USDC -> WETH', async function () {
        await testRate(tokens.WBTC, tokens.WETH, tokens.USDC);
    });

    const testRate = async function (srcToken, dstToken, connector) {
        const dodoResult = await dodoOracle.getRate(srcToken, dstToken, connector);
        const v3Result = await uniswapV3Oracle.getRate(srcToken, dstToken, connector);
        assertRoughlyEqualValues(v3Result.rate.toString(), dodoResult.rate.toString(), 0.05);
    };
});
