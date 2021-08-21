const { expectRevert } = require('@openzeppelin/test-helpers');
const { tokens, assertRoughlyEqualValues } = require('./helpers.js');

const ChainlinkOracle = artifacts.require('ChainlinkOracle');
const UniswapV3Oracle = artifacts.require('UniswapV3Oracle');
const initcodeHashV3 = '0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54';

describe('ChainlinkOracle', async function () {
    before(async function () {
        this.chainlinkOracle = await ChainlinkOracle.new('0x47Fb2585D2C56Fe188D0E6ec628a38b74fCeeeDf');
        this.uniswapV3Oracle = await UniswapV3Oracle.new(initcodeHashV3);
    });

    it('USDT -> DAI', async function () {
        const actual = await this.chainlinkOracle.getRate(tokens.USDT, tokens.DAI, tokens.NONE);
        const expected = await this.uniswapV3Oracle.getRate(tokens.USDT, tokens.DAI, tokens.NONE);
        await assertRoughlyEqualValues(expected.rate.toString(), actual.rate.toString(), 0.01);
    });

    it('DAI -> USDT', async function () {
        const actual = await this.chainlinkOracle.getRate(tokens.DAI, tokens.USDT, tokens.NONE);
        const expected = await this.uniswapV3Oracle.getRate(tokens.DAI, tokens.USDT, tokens.NONE);
        await assertRoughlyEqualValues(expected.rate.toString(), actual.rate.toString(), 0.01);
    });

    it('ETH -> DAI', async function () {
        const actual = await this.chainlinkOracle.getRate(tokens.ETH, tokens.DAI, tokens.NONE);
        const expected = await this.uniswapV3Oracle.getRate(tokens.WETH, tokens.DAI, tokens.NONE);
        await assertRoughlyEqualValues(expected.rate.toString(), actual.rate.toString(), 0.01);
    });

    it('DAI -> ETH', async function () {
        const actual = await this.chainlinkOracle.getRate(tokens.DAI, tokens.ETH, tokens.NONE);
        const expected = await this.uniswapV3Oracle.getRate(tokens.DAI, tokens.WETH, tokens.NONE);
        await assertRoughlyEqualValues(expected.rate.toString(), actual.rate.toString(), 0.01);
    });

    it('Supports tokens with custom decimals', async function () {
        const actual = await this.chainlinkOracle.getRate(tokens.USDT, tokens.ETH, tokens.NONE);
        const expected = await this.uniswapV3Oracle.getRate(tokens.USDT, tokens.WETH, tokens.NONE);
        await assertRoughlyEqualValues(expected.rate.toString(), actual.rate.toString(), 0.01);
    });

    it('Throws if connector is specified', async function () {
        await expectRevert(
            this.chainlinkOracle.getRate(tokens.DAI, tokens.DAI, tokens.USDT),
            'CO: connector should be None',
        );
    });
});
