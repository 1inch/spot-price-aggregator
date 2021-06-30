const { BN, ether } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const { tokens, assertRoughlyEquals, getUniswapV3Fee } = require('./helpers.js');

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
        await testRate(this, tokens.DAI, tokens.WETH, tokens.NONE)
    });

    it.only('weth -> dai', async function () {
        await testRate(this, tokens.WETH, tokens.DAI, tokens.NONE)
    });

    async function testRate(self, srcToken, dstToken, connector) {
        const v2Result = await self.uniswapV2LikeOracle.getRate(srcToken, dstToken, connector);
        const v3Result = await self.uniswapV3LikeOracle.getRate(srcToken, dstToken, connector, getUniswapV3Fee(0.3));
        assertRoughlyEquals(v3Result.rate.toString(), v2Result.rate.toString(), 3);
        assertRoughlyEquals(v3Result.weight.toString(), v2Result.weight.toString(), 3);
    }
});
