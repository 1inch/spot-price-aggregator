const { ethers } = require('hardhat');
const { expect, ether } = require('@1inch/solidity-utils');
const { tokens } = require('./helpers.js');

describe('UniswapOracle', async function () {
    before(async function () {
        const UniswapOracle = await ethers.getContractFactory('UniswapOracle');
        this.uniswapOracle = await UniswapOracle.deploy('0xc0a47dFe034B400B47bDaD5FecDa2621de6c4d95');
        await this.uniswapOracle.deployed();
    });

    it('weth -> dai', async function () {
        const rate = await this.uniswapOracle.getRate(tokens.WETH, tokens.DAI, tokens.ETH);
        expect(rate.rate).to.gt(ether('1000'));
    });

    it('eth -> dai', async function () {
        const rate = await this.uniswapOracle.getRate(tokens.ETH, tokens.DAI, tokens.NONE);
        expect(rate.rate).to.gt(ether('1000'));
    });

    it('dai -> eth', async function () {
        const rate = await this.uniswapOracle.getRate(tokens.DAI, tokens.ETH, tokens.NONE);
        expect(rate.rate).to.lt(ether('0.001'));
    });
});
