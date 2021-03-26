const { ether } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const { tokens } = require('./helpers.js');

const MooniswapOracle = artifacts.require('MooniswapOracle');
const mooniswapFactory = '0xbAF9A5d4b0052359326A6CDAb54BABAa3a3A9643';

describe('MooniswapOracle', async function () {
    before(async function () {
        this.mooniswapOracle = await MooniswapOracle.new(mooniswapFactory);
    });

    it('eth -> dai', async function () {
        const rate = await this.mooniswapOracle.getRate(tokens.ETH, tokens.DAI, tokens.NONE);
        expect(rate.rate).to.be.bignumber.greaterThan(ether('1000'));
    });

    it('eth -> usdc -> 1inch', async function () {
        const rate = await this.mooniswapOracle.getRate(tokens.ETH, tokens['1INCH'], tokens.USDC);
        expect(rate.rate).to.be.bignumber.greaterThan(ether('200'));
    });
});
