const { expectRevert } = require('@openzeppelin/test-helpers');
const { tokens, assertRoughlyEqualValues, sqrt } = require('./helpers.js');

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
            this.kyberDmmOracle.contract.methods.getRate(tokens.KNC, tokens.EEE, tokens.NONE).call(),
            'KO: no pools',
        );
    });

    it('should revert with amount of pools with connector error', async function () {
        await expectRevert(
            this.kyberDmmOracle.contract.methods.getRate(tokens.KNC, tokens.WETH, tokens.MKR).call(),
            'KO: no pools with connector',
        );
    });

    it('KNC -> WETH', async function () {
        await testRate(this, tokens.KNC, tokens.WETH, tokens.NONE);
    });

    it('WETH -> KNC', async function () {
        await testRate(this, tokens.WETH, tokens.KNC, tokens.NONE);
    });

    it('USDT -> WETH', async function () {
        await testRate(this, tokens.USDT, tokens.WETH, tokens.NONE);
    });

    it('WETH -> USDT', async function () {
        await testRate(this, tokens.WETH, tokens.USDT, tokens.NONE);
    });

    it('USDC -> WETH', async function () {
        await testRate(this, tokens.USDC, tokens.WETH, tokens.NONE);
    });

    it('WETH -> USDC', async function () {
        await testRate(this, tokens.WETH, tokens.USDC, tokens.NONE);
    });

    it('KNC -> WETH -> USDC', async function () {
        await testRate(this, tokens.KNC, tokens.USDC, tokens.WETH);
    });

    it('USDC -> WETH -> KNC', async function () {
        await testRate(this, tokens.USDC, tokens.KNC, tokens.WETH);
    });

    async function testRate (self, srcToken, dstToken, connector) {
        const kyberResult = await self.kyberDmmOracle.getRate(srcToken, dstToken, connector);
        const v3Result = await self.uniswapV3Oracle.getRate(srcToken, dstToken, connector);

        const v3weightCalc = v3Result.weight.mul(v3Result.weight);
        const v3rateCalc = v3Result.rate.mul(v3weightCalc);
        const kyberWeightCalc = kyberResult.weight;
        const kyberRateCalc = kyberResult.rate;

        const newRate = v3rateCalc.add(kyberRateCalc.mul(kyberWeightCalc));
        const newWeight = v3weightCalc.add(kyberWeightCalc);

        assertRoughlyEqualValues(v3Result.rate.toString(), newRate.div(newWeight).toString(), 0.05);
        assertRoughlyEqualValues(v3Result.weight.toString(), sqrt(newWeight).toString(), 0.00001);
    }
});
