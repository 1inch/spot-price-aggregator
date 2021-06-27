const { BN, ether } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const { tokens } = require('./helpers.js');

const UniswapV2LikeOracle = artifacts.require('UniswapV2LikeOracle');
const UniswapV3LikeOracle = artifacts.require('UniswapV3LikeOracle');
const uniswapV2Factory = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f';
const uniswapV3Pool = '0xc2e9f25be6257c210d7adf0d4cd6e3e881ba25f8';
const initcodeHash = '0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f';

describe('UniswapV3LikeOracle', async function () {
    before(async function () {
        this.uniswapV2LikeOracle = await UniswapV2LikeOracle.new(uniswapV2Factory, initcodeHash);
        this.uniswapV3LikeOracle = await UniswapV3LikeOracle.new([tokens.DAI], [tokens.WETH], [uniswapV3Pool]);
    });

    it.only('dai -> weth', async function () {
        const rate = await this.uniswapV2LikeOracle.getRate(tokens.DAI, tokens.WETH, tokens.NONE);
        const rate2 = await this.uniswapV3LikeOracle.getRate(tokens.DAI, tokens.WETH, tokens.NONE);
        console.log(rate.rate.toString());
        console.log(rate.weight.toString());
        console.log(rate2.rate.toString());
        console.log(rate2.weight.toString());
        expect(rate.rate).to.be.bignumber.equal(rate2.rate.toString());
    });
});
