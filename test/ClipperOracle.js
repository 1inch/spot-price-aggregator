const { expectRevert } = require('@openzeppelin/test-helpers');
const { tokens, assertRoughlyEqualValues } = require('./helpers.js');

const ClipperOracle = artifacts.require('ClipperOracle');
const UniswapV3Oracle = artifacts.require('UniswapV3Oracle');
const initcodeHashV3 = '0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54';

describe.only('ClipperOracle', async function () {
    before(async function () {
        this.clipperOracle = await ClipperOracle.new('0xe82906b6B1B04f631D126c974Af57a3A7B6a99d9');
        this.uniswapV3Oracle = await UniswapV3Oracle.new(initcodeHashV3);
    });

    it('USDT -> DAI', async function () {
        const actual = await this.clipperOracle.getRate(tokens.USDT, tokens.DAI, tokens.NONE);
        const expected = await this.uniswapV3Oracle.getRate(tokens.USDT, tokens.DAI, tokens.NONE);
        await assertRoughlyEqualValues(expected.rate.toString(), actual.rate.toString(), 0.01);
    });

    it('DAI -> USDT', async function () {
        const actual = await this.clipperOracle.getRate(tokens.DAI, tokens.USDT, tokens.NONE);
        const expected = await this.uniswapV3Oracle.getRate(tokens.DAI, tokens.USDT, tokens.NONE);
        await assertRoughlyEqualValues(expected.rate.toString(), actual.rate.toString(), 0.01);
    });

    it('ETH -> DAI', async function () {
        const actual = await this.clipperOracle.getRate(tokens.ETH, tokens.DAI, tokens.NONE);
        const expected = await this.uniswapV3Oracle.getRate(tokens.WETH, tokens.DAI, tokens.NONE);
        await assertRoughlyEqualValues(expected.rate.toString(), actual.rate.toString(), 0.01);
    });

    it('DAI -> ETH', async function () {
        const actual = await this.clipperOracle.getRate(tokens.DAI, tokens.ETH, tokens.NONE);
        const expected = await this.uniswapV3Oracle.getRate(tokens.DAI, tokens.WETH, tokens.NONE);
        await assertRoughlyEqualValues(expected.rate.toString(), actual.rate.toString(), 0.01);
    });

    it('Supports tokens with custom decimals', async function () {
        const actual = await this.clipperOracle.getRate(tokens.USDT, tokens.ETH, tokens.NONE);
        const expected = await this.uniswapV3Oracle.getRate(tokens.USDT, tokens.WETH, tokens.NONE);
        await assertRoughlyEqualValues(expected.rate.toString(), actual.rate.toString(), 0.01);
    });
});
