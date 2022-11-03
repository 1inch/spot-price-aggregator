const { ethers } = require('hardhat');
const { expect } = require('@1inch/solidity-utils');
const { tokens, assertRoughlyEqualValues } = require('./helpers.js');

describe('ChainlinkOracle', async function () {
    before(async function () {
        const ChainlinkOracle = await ethers.getContractFactory('ChainlinkOracle');
        const UniswapV3Oracle = await ethers.getContractFactory('UniswapV3Oracle');
        this.chainlinkOracle = await ChainlinkOracle.deploy('0x47Fb2585D2C56Fe188D0E6ec628a38b74fCeeeDf');
        await this.chainlinkOracle.deployed();
        this.uniswapV3Oracle = await UniswapV3Oracle.deploy();
        await this.uniswapV3Oracle.deployed();
    });

    it('USDT -> DAI', async function () {
        const actual = await this.chainlinkOracle.getRate(tokens.USDT, tokens.DAI, tokens.NONE);
        const expected = await this.uniswapV3Oracle.getRate(tokens.USDT, tokens.DAI, tokens.NONE);
        await assertRoughlyEqualValues(expected.rate.toString(), actual.rate.toString(), 0.05);
    });

    it('DAI -> USDT', async function () {
        const actual = await this.chainlinkOracle.getRate(tokens.DAI, tokens.USDT, tokens.NONE);
        const expected = await this.uniswapV3Oracle.getRate(tokens.DAI, tokens.USDT, tokens.NONE);
        await assertRoughlyEqualValues(expected.rate.toString(), actual.rate.toString(), 0.05);
    });

    it('ETH -> DAI', async function () {
        const actual = await this.chainlinkOracle.getRate(tokens.ETH, tokens.DAI, tokens.NONE);
        const expected = await this.uniswapV3Oracle.getRate(tokens.WETH, tokens.DAI, tokens.NONE);
        await assertRoughlyEqualValues(expected.rate.toString(), actual.rate.toString(), 0.05);
    });

    it('DAI -> ETH', async function () {
        const actual = await this.chainlinkOracle.getRate(tokens.DAI, tokens.ETH, tokens.NONE);
        const expected = await this.uniswapV3Oracle.getRate(tokens.DAI, tokens.WETH, tokens.NONE);
        await assertRoughlyEqualValues(expected.rate.toString(), actual.rate.toString(), 0.05);
    });

    it('Supports tokens with custom decimals', async function () {
        const actual = await this.chainlinkOracle.getRate(tokens.USDT, tokens.ETH, tokens.NONE);
        const expected = await this.uniswapV3Oracle.getRate(tokens.USDT, tokens.WETH, tokens.NONE);
        await assertRoughlyEqualValues(expected.rate.toString(), actual.rate.toString(), 0.01);
    });

    it('Throws if connector is specified', async function () {
        await expect(
            this.chainlinkOracle.getRate(tokens.DAI, tokens.DAI, tokens.USDT),
        ).to.be.revertedWith('CO: connector should be None');
    });
});
