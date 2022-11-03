const { ethers } = require('hardhat');
const { expect } = require('@1inch/solidity-utils');
const { tokens, assertRoughlyEqualValues } = require('./helpers.js');

const dodoZoo = '0x3A97247DF274a17C59A3bd12735ea3FcDFb49950';

describe('DodoOracle', async () => {
    before(async () => {
        const DodoOracle = await ethers.getContractFactory('DodoOracle');
        const UniswapV3Oracle = await ethers.getContractFactory('UniswapV3Oracle');
        this.dodoOracle = await DodoOracle.deploy(dodoZoo);
        await this.dodoOracle.deployed();
        this.uniswapV3Oracle = await UniswapV3Oracle.deploy();
        await this.uniswapV3Oracle.deployed();
    });

    it('should revert with amount of pools error', async () => {
        await expect(
            this.dodoOracle.getRate(tokens.USDT, tokens['1INCH'], tokens.NONE),
        ).to.be.revertedWith('DO: Dodo not found');
    });

    it('WETH -> USDC', async () => {
        await testRate(tokens.WETH, tokens.USDC, tokens.NONE);
    });

    it('USDC -> WETH', async () => {
        await testRate(tokens.USDC, tokens.WETH, tokens.NONE);
    });

    it('WETH -> USDC -> WBTC', async () => {
        await testRate(tokens.WETH, tokens.WBTC, tokens.USDC);
    });

    it('WBTC -> USDC -> WETH', async () => {
        await testRate(tokens.WBTC, tokens.WETH, tokens.USDC);
    });

    const testRate = async (srcToken, dstToken, connector) => {
        const dodoResult = await this.dodoOracle.getRate(srcToken, dstToken, connector);
        const v3Result = await this.uniswapV3Oracle.getRate(srcToken, dstToken, connector);
        assertRoughlyEqualValues(v3Result.rate.toString(), dodoResult.rate.toString(), 0.05);
    };
});
