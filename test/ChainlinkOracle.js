const { ether, expectRevert } = require('@openzeppelin/test-helpers');
const { tokens, assertRoughlyEqualValues } = require('./helpers.js');

const ChainlinkOracle = artifacts.require('ChainlinkOracle');

describe('ChainlinkOracle', async function () {
    before(async function () {
        this.chainlinkOracle = await ChainlinkOracle.new('0x47Fb2585D2C56Fe188D0E6ec628a38b74fCeeeDf');
    });

    it('USDT -> DAI', async function () {
        const rate = await this.chainlinkOracle.getRate(tokens.USDT, tokens.DAI, tokens.NONE);
        assertRoughlyEqualValues(ether('1'), rate.rate, 0.01);
    });

    it('DAI -> USDT', async function () {
        const rate = await this.chainlinkOracle.getRate(tokens.DAI, tokens.USDT, tokens.NONE);
        assertRoughlyEqualValues(ether('1'), rate.rate, 0.01);
    });

    it('ETH -> DAI', async function () {
        const rate = await this.chainlinkOracle.getRate(tokens.ETH, tokens.DAI, tokens.NONE);
        assertRoughlyEqualValues(ether('2768'), rate.rate, 0.01);
    });

    it('DAI -> ETH', async function () {
        const rate = await this.chainlinkOracle.getRate(tokens.DAI, tokens.ETH, tokens.NONE);
        assertRoughlyEqualValues('361296233107496', rate.rate, 0.01);
    });

    it('Throws if connector is specified', async function () {
        await expectRevert(
            this.chainlinkOracle.getRate(tokens.DAI, tokens.DAI, tokens.USDT),
            'CO: connector should be None',
        );
    });
});
