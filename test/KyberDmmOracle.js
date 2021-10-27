const { expectRevert } = require('@openzeppelin/test-helpers');
const { tokens, assertRoughlyEqualValues} = require('./helpers.js');

const KyberDmmOracle = artifacts.require('KyberDmmOracle');
const UniswapV3Oracle = artifacts.require('UniswapV3Oracle');
const initcodeHashV3 = '0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54';

describe.only('KyberDmmOracle', async function () {
    const kncDecimals = 18;
    const usdcDecimals = 6;

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

    it('KNC -> WETH -> USDC', async function () {
        await testRate(this, tokens.KNC, tokens.USDC, tokens.WETH);
    });

    it('USDC -> WETH -> KNC', async function () {
        await testRate(this, tokens.USDC, tokens.KNC, tokens.WETH);
    });

    async function testRate (self, srcToken, dstToken, connector) {
        const kyberResult = await self.kyberDmmOracle.getRate(srcToken, dstToken, connector);
        const v3Result = await self.uniswapV3Oracle.getRate(srcToken, dstToken, connector);
        assertRoughlyEqualValues(v3Result.rate.toString(), kyberResult.rate.toString(), 0.05);
    }
});
