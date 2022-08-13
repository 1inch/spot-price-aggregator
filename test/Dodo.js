const { expectRevert } = require('@openzeppelin/test-helpers');
const { tokens, assertRoughlyEqualValues } = require('./helpers.js');

const DodoOracle = artifacts.require('DodoOracle');
const dodoZoo = '0x3A97247DF274a17C59A3bd12735ea3FcDFb49950';
const UniswapV3Oracle = artifacts.require('UniswapV3Oracle');
const initcodeHashV3 = '0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54';

describe('DodoOracle', async () => {
    before(async () => {
        this.dodoOracle = await DodoOracle.new(dodoZoo);
        this.uniswapV3Oracle = await UniswapV3Oracle.new(initcodeHashV3);
    });

    it('should revert with amount of pools error', async () => {
        await expectRevert(
            this.dodoOracle.getRate(tokens.USDT, tokens['1INCH'], tokens.NONE),
            'DO: Dodo not found',
        );
    });

    it('WETH -> USDC', async () => {
        await testRate(this, tokens.WETH, tokens.USDC, tokens.NONE);
    });

    it('USDC -> WETH', async () => {
        await testRate(this, tokens.USDC, tokens.WETH, tokens.NONE);
    });

    it('WETH -> USDC -> WBTC', async () => {
        await testRate(this, tokens.WETH, tokens.WBTC, tokens.USDC);
    });

    it('WBTC -> USDC -> WETH', async () => {
        await testRate(this, tokens.WBTC, tokens.WETH, tokens.USDC);
    });

    const testRate = async (self, srcToken, dstToken, connector) => {
        const dodoResult = await self.dodoOracle.getRate(srcToken, dstToken, connector);
        const v3Result = await self.uniswapV3Oracle.getRate(srcToken, dstToken, connector);
        assertRoughlyEqualValues(v3Result.rate.toString(), dodoResult.rate.toString(), 0.05);
    };
});
