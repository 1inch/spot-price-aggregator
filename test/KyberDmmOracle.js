const { expectRevert } = require('@openzeppelin/test-helpers');
const { tokens, assertRoughlyEqualValues } = require('./helpers.js');

const KyberDmmOracle = artifacts.require('KyberDmmOracle');
const UniswapV3Oracle = artifacts.require('UniswapV3Oracle');
const initcodeHashV3 = '0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54';

describe('KyberDmmOracle', async function () {
    before(async function () {
        this.kyberDmmOracle = await KyberDmmOracle.new('0x833e4083b7ae46cea85695c4f7ed25cdad8886de');
        this.uniswapV3Oracle = await UniswapV3Oracle.new(initcodeHashV3);
    });

    it('should revert with amount of pools error', async function () {
        await expectRevert(
            this.kyberDmmOracle.contract.methods.getRate(tokens.USDT, tokens.EEE, tokens.NONE).call(),
            'KO: no pools',
        );
    });

    it('should revert with amount of pools with connector error', async function () {
        await expectRevert(
            this.kyberDmmOracle.contract.methods.getRate(tokens.USDT, tokens.WETH, tokens.MKR).call(),
            'KO: no pools with connector',
        );
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
