const { expectRevert } = require('@openzeppelin/test-helpers');
const { tokens, assertRoughlyEqualValues } = require('./helpers.js');

const SolidlyOracle = artifacts.require('SolidlyOracle');
const pairCodeHash = '0x57ae84018c47ebdaf7ddb2d1216c8c36389d12481309af65428eb6d460f747a4';
const UniswapV3Oracle = artifacts.require('UniswapV3Oracle');
const initcodeHashV3 = '0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54';

describe('SolidlyOracle on Fantom', async function () {
    // before(async function () {
    //     this.solidlyOracle = await SolidlyOracle.new('0x3faab499b519fdc5819e3d7ed0c26111904cbc28', pairCodeHash);
    //     this.uniswapV3Oracle = await UniswapV3Oracle.new(initcodeHashV3);
    // });

    // it('should revert with amount of pools with connector error', async function () {
    //     await expectRevert(
    //         this.solidlyOracle.contract.methods.getRate(tokens.USDT, tokens.WETH, tokens.MKR).call(),
    //         'SO: connector should be None',
    //     );
    // });

    // it('USDC -> USDT', async function () {
    //     await testRate(this, tokens.USDC, tokens.USDT, tokens.NONE);
    // });

    // // it('USDT -> USDC', async function () {
    // //     await testRate(this, tokens.USDT, tokens.USDC, tokens.NONE);
    // // });

    // // it('WBTC -> WETH', async function () {
    // //     await testRate(this, tokens.WBTC, tokens.WETH, tokens.NONE);
    // // });

    // // it('WETH -> WBTC', async function () {
    // //     await testRate(this, tokens.WETH, tokens.WBTC, tokens.NONE);
    // // });

    // // it('USDC -> USDT -> WBTC', async function () {
    // //     await testRate(this, tokens.USDC, tokens.WBTC, tokens.USDT);
    // // });

    // // it('WBTC -> USDT -> USDC', async function () {
    // //     await testRate(this, tokens.WBTC, tokens.USDC, tokens.USDT);
    // // });

    // async function testRate (self, srcToken, dstToken, connector) {
    //     const solidlyResult = await self.solidlyOracle.getRate(srcToken, dstToken, connector);
    //     const v3Result = await self.uniswapV3Oracle.getRate(srcToken, dstToken, connector);
    //     assertRoughlyEqualValues(v3Result.rate.toString(), solidlyResult.rate.toString(), 0.05);
    // }
});
