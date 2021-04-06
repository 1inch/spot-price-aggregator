const { ether } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const { tokens } = require('./helpers.js');

const UniswapOracle = artifacts.require('UniswapOracle');

describe('UniswapOracle', async function () {
    before(async function () {
        this.uniswapOracle = await UniswapOracle.new('0xc0a47dFe034B400B47bDaD5FecDa2621de6c4d95');
    });

    it('weth -> dai', async function () {
        const rate = await this.uniswapOracle.getRate(tokens.WETH, tokens.DAI, tokens.ETH);
        expect(rate.rate).to.be.bignumber.greaterThan(ether('1000'));
    });

    it('eth -> dai', async function () {
        const rate = await this.uniswapOracle.getRate(tokens.ETH, tokens.DAI, tokens.NONE);
        expect(rate.rate).to.be.bignumber.greaterThan(ether('1000'));
    });

    it('dai -> eth', async function () {
        const rate = await this.uniswapOracle.getRate(tokens.DAI, tokens.ETH, tokens.NONE);
        expect(rate.rate).to.be.bignumber.lessThan(ether('0.001'));
    });
});
