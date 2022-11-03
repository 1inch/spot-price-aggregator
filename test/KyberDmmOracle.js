const { ethers } = require('hardhat');
const { expect } = require('@1inch/solidity-utils');
const { tokens, assertRoughlyEqualValues } = require('./helpers.js');

describe('KyberDmmOracle', async function () {
    before(async function () {
        const KyberDmmOracle = await ethers.getContractFactory('KyberDmmOracle');
        const UniswapV3Oracle = await ethers.getContractFactory('UniswapV3Oracle');
        this.kyberDmmOracle = await KyberDmmOracle.deploy('0x833e4083b7ae46cea85695c4f7ed25cdad8886de');
        await this.kyberDmmOracle.deployed();
        this.uniswapV3Oracle = await UniswapV3Oracle.deploy();
        await this.uniswapV3Oracle.deployed();
    });

    it('should revert with amount of pools error', async function () {
        await expect(
            this.kyberDmmOracle.callStatic.getRate(tokens.USDT, tokens.EEE, tokens.NONE),
        ).to.be.revertedWith('KO: no pools');
    });

    it('should revert with amount of pools with connector error', async function () {
        await expect(
            this.kyberDmmOracle.callStatic.getRate(tokens.USDT, tokens.WETH, tokens.MKR),
        ).to.be.revertedWith('KO: no pools with connector');
    });

    it('USDC -> USDT', async function () {
        await testRate(this, tokens.USDC, tokens.USDT, tokens.NONE);
    });

    it('USDT -> USDC', async function () {
        await testRate(this, tokens.USDT, tokens.USDC, tokens.NONE);
    });

    it('WBTC -> WETH', async function () {
        await testRate(this, tokens.WBTC, tokens.WETH, tokens.NONE);
    });

    it('WETH -> WBTC', async function () {
        await testRate(this, tokens.WETH, tokens.WBTC, tokens.NONE);
    });

    it('USDC -> USDT -> WBTC', async function () {
        await testRate(this, tokens.USDC, tokens.WBTC, tokens.USDT);
    });

    it('WBTC -> USDT -> USDC', async function () {
        await testRate(this, tokens.WBTC, tokens.USDC, tokens.USDT);
    });

    async function testRate (self, srcToken, dstToken, connector) {
        const kyberResult = await self.kyberDmmOracle.getRate(srcToken, dstToken, connector);
        const v3Result = await self.uniswapV3Oracle.getRate(srcToken, dstToken, connector);
        assertRoughlyEqualValues(v3Result.rate.toString(), kyberResult.rate.toString(), 0.05);
    }
});
