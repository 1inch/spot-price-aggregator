const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { expect, ether } = require('@1inch/solidity-utils');
const { tokens, deployContract } = require('./helpers.js');

const uniswapV2 = {
    factory: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
    initcodeHash: '0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f',
};
const shibaswap = {
    factory: '0x115934131916c8b277dd010ee02de363c09d037c',
    initcodeHash: '0x65d1a3b1e46c6e4f1be1ad5f99ef14dc488ae0549dc97db9b30afe2241ce1c7a',
};

describe('UniswapV2LikeOracle', function () {
    async function initContracts () {
        const uniswapV2LikeOracle = await deployContract('UniswapV2LikeOracle', [uniswapV2.factory, uniswapV2.initcodeHash]);
        const shibaswapOracle = await deployContract('UniswapV2LikeOracle', [shibaswap.factory, shibaswap.initcodeHash]);
        return { uniswapV2LikeOracle, shibaswapOracle };
    }

    it('uniswapV2 weth -> dai', async function () {
        const { uniswapV2LikeOracle } = await loadFixture(initContracts);
        const rate = await uniswapV2LikeOracle.getRate(tokens.WETH, tokens.DAI, tokens.NONE);
        expect(rate.rate).to.gt(ether('1000'));
    });

    it('uniswapV2 weth -> usdc -> dai', async function () {
        const { uniswapV2LikeOracle } = await loadFixture(initContracts);
        const rate = await uniswapV2LikeOracle.getRate(tokens.WETH, tokens.DAI, tokens.USDC);
        expect(rate.rate).to.gt(ether('1000'));
    });

    it('shibaswap weth -> dai', async function () {
        const { shibaswapOracle } = await loadFixture(initContracts);
        const rate = await shibaswapOracle.getRate(tokens.WETH, tokens.DAI, tokens.NONE);
        expect(rate.rate).to.gt(ether('1000'));
    });

    it('shibaswap weth -> usdc -> dai', async function () {
        const { shibaswapOracle } = await loadFixture(initContracts);
        const rate = await shibaswapOracle.getRate(tokens.WETH, tokens.DAI, tokens.USDC);
        expect(rate.rate).to.gt(ether('1000'));
    });
});
