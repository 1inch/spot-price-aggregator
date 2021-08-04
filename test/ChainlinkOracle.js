const { ether } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const { tokens, assertRoughlyEqualValues } = require('./helpers.js');

const ChainlinkOracle = artifacts.require('ChainlinkOracle');

describe.only('ChainlinkOracle', async function () {
    before(async function () {
        this.chainlinkOracle = await ChainlinkOracle.new('0x47Fb2585D2C56Fe188D0E6ec628a38b74fCeeeDf');
    });

    it('USDT -> DAI', async function () {
        const rate = await this.chainlinkOracle.getRate(tokens.USDT, tokens.DAI, tokens.NONE);
        assertRoughlyEqualValues(rate.rate, ether('1'), 0.01);
    });

    it('DAI -> USDT', async function () {
        const rate = await this.chainlinkOracle.getRate(tokens.DAI, tokens.USDT, tokens.NONE);
        assertRoughlyEqualValues(rate.rate, ether('1'), 0.01);
    });

    it('DAI -> USDT -> DAI', async function () {
        const rate = await this.chainlinkOracle.getRate(tokens.DAI, tokens.DAI, tokens.USDT);
        expect(rate.rate).to.be.bignumber.equal(ether('1'));
    });

    it('ETH -> DAI', async function () {
        const rate = await this.chainlinkOracle.getRate(tokens.ETH, tokens.DAI, tokens.NONE);
        assertRoughlyEqualValues(rate.rate, ether('1'), 0.01);
    });

    it('DAI -> ETH', async function () {
        const rate = await this.chainlinkOracle.getRate(tokens.DAI, tokens.ETH, tokens.NONE);
        assertRoughlyEqualValues(rate.rate, ether('1'), 0.01);
    });
});
