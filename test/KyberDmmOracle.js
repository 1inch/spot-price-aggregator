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

    it.skip('KNC -> WETH //todo: fix KyberDmmOracle', async function () {
        await testRate(this, tokens.KNC, tokens.WETH, tokens.NONE);
    });

    it.skip('WETH -> KNC //todo: fix KyberDmmOracle', async function () {
        await testRate(this, tokens.WETH, tokens.KNC, tokens.NONE);
    });

    it.skip('KNC -> WETH -> USDC //todo: fix KyberDmmOracle', async function () {
        await testRate(this, tokens.KNC, tokens.USDC, tokens.WETH);
    });

    it.skip('USDC -> WETH -> KNC //todo: fix KyberDmmOracle', async function () {
        await testRate(this, tokens.USDC, tokens.KNC, tokens.WETH);
    });

    async function testRate (self, srcToken, dstToken, connector) {
        const kyberResult = await self.kyberDmmOracle.getRate(srcToken, dstToken, connector);
        const v3Result = await self.uniswapV3Oracle.getRate(srcToken, dstToken, connector);
        assertRoughlyEqualValues(v3Result.rate.toString(), kyberResult.rate.toString(), 0.05);
    }
});
