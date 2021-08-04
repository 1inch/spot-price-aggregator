const { ether, BN } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const { tokens, assertRoughlyEquals } = require('./helpers.js');

const ChainlinkOracle = artifacts.require('ChainlinkOracle');

describe('ChainlinkOracle', async function () {
    before(async function () {
        this.chainlinkOracle = await ChainlinkOracle.new('0x47Fb2585D2C56Fe188D0E6ec628a38b74fCeeeDf');
    });

    it('USDT -> DAI', async function () {
        const rate = await this.chainlinkOracle.getRate(tokens.USDT, tokens.DAI, tokens.NONE);
        assertRoughlyEquals(rate.rate, new BN('999446006306286194'), 3);
    });

    it('DAI -> USDT', async function () {
        const rate = await this.chainlinkOracle.getRate(tokens.DAI, tokens.USDT, tokens.NONE);
        assertRoughlyEquals(rate.rate, new BN('1000554300772846383'), 3);
    });

    it('DAI -> USDT -> DAI', async function () {
        const rate = await this.chainlinkOracle.getRate(tokens.DAI, tokens.DAI, tokens.USDT);
        expect(rate.rate).to.be.bignumber.equal(ether('1'));
    });
});
