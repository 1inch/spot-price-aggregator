const { ethers } = require('hardhat');
const { expect, ether } = require('@1inch/solidity-utils');
const { tokens } = require('./helpers.js');

const mooniswapFactory = '0xbAF9A5d4b0052359326A6CDAb54BABAa3a3A9643';

describe('MooniswapOracle', async function () {
    before(async function () {
        const MooniswapOracle = await ethers.getContractFactory('MooniswapOracle');
        this.mooniswapOracle = await MooniswapOracle.deploy(mooniswapFactory);
        await this.mooniswapOracle.deployed();
    });

    it('eth -> dai', async function () {
        const rate = await this.mooniswapOracle.getRate(tokens.ETH, tokens.DAI, tokens.NONE);
        expect(rate.rate).to.be.gt(ether('1000'));
    });

    it('eth -> usdc -> 1inch', async function () {
        const rate = await this.mooniswapOracle.getRate(tokens.ETH, tokens['1INCH'], tokens.USDC);
        expect(rate.rate).to.be.gt(ether('200'));
    });
});
