const { BN, ether } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const { tokens, assertRoughlyEquals } = require('./helpers.js');

const UniswapV2LikeOracle = artifacts.require('UniswapV2LikeOracle');
const UniswapV3LikeOracle = artifacts.require('UniswapV3LikeOracle');
const uniswapV2Factory = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f';
const uniswapV3Factory = '0x1F98431c8aD98523631AE4a59f267346ea31F984';
const initcodeHash = '0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f';

describe('UniswapV3LikeOracle', async function () {
    before(async function () {
        this.uniswapV2LikeOracle = await UniswapV2LikeOracle.new(uniswapV2Factory, initcodeHash);
        this.uniswapV3LikeOracle = await UniswapV3LikeOracle.new(uniswapV3Factory);
    });

    it.only('dai -> weth', async function () {
        const v2Result = await this.uniswapV2LikeOracle.getRate(tokens.DAI, tokens.WETH, tokens.NONE);
        const v3Result = await this.uniswapV3LikeOracle.getRate(tokens.DAI, tokens.WETH, tokens.NONE, 3000);
        console.log(v2Result.rate.toString());
        console.log(v2Result.weight.toString());
        console.log(v3Result.rate.toString());
        console.log(v3Result.weight.toString());
        assertRoughlyEquals(v3Result.rate.toString(), v2Result.rate.toString(), 3);
    });
});
