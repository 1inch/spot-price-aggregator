const { ether } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const { tokens } = require('./helpers.js');

const UniswapV2LikeOracle = artifacts.require('UniswapV2LikeOracle');
const uniswapV2Factory = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f';
const initcodeHash = '0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f';

describe('UniswapV2LikeOracle', async function () {
    before(async function () {
        this.uniswapV2LikeOracle = await UniswapV2LikeOracle.new(uniswapV2Factory, initcodeHash);
    });

    it('weth -> dai', async function () {
        const rate = await this.uniswapV2LikeOracle.getRate(tokens.WETH, tokens.DAI, tokens.NONE);
        expect(rate.rate).to.be.bignumber.greaterThan(ether('1000'));
    });

    it('weth -> usdc -> dai', async function () {
        const rate = await this.uniswapV2LikeOracle.getRate(tokens.WETH, tokens.DAI, tokens.USDC);
        expect(rate.rate).to.be.bignumber.greaterThan(ether('1000'));
    });
});
