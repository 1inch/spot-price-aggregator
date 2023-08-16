const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { expect, ether, deployContract } = require('@1inch/solidity-utils');
const {
    tokens,
    deployParams: { ShibaSwap, UniswapV2 },
    defaultValues: { thresholdFilter },
} = require('./helpers.js');

describe('UniswapV2LikeOracle', function () {
    async function initContracts () {
        const uniswapV2LikeOracle = await deployContract('UniswapV2LikeOracle', [UniswapV2.factory, UniswapV2.initcodeHash]);
        const shibaswapOracle = await deployContract('UniswapV2LikeOracle', [ShibaSwap.factory, ShibaSwap.initcodeHash]);
        return { uniswapV2LikeOracle, shibaswapOracle };
    }

    it('uniswapV2 weth -> dai', async function () {
        const { uniswapV2LikeOracle } = await loadFixture(initContracts);
        const rate = await uniswapV2LikeOracle.getRate(tokens.WETH, tokens.DAI, tokens.NONE, thresholdFilter);
        expect(rate.rate).to.gt(ether('1000'));
    });

    it('uniswapV2 weth -> usdc -> dai', async function () {
        const { uniswapV2LikeOracle } = await loadFixture(initContracts);
        const rate = await uniswapV2LikeOracle.getRate(tokens.WETH, tokens.DAI, tokens.USDC, thresholdFilter);
        expect(rate.rate).to.gt(ether('1000'));
    });

    it('shibaswap weth -> dai', async function () {
        const { shibaswapOracle } = await loadFixture(initContracts);
        const rate = await shibaswapOracle.getRate(tokens.WETH, tokens.DAI, tokens.NONE, thresholdFilter);
        expect(rate.rate).to.gt(ether('1000'));
    });

    it('shibaswap weth -> usdc -> dai', async function () {
        const { shibaswapOracle } = await loadFixture(initContracts);
        const rate = await shibaswapOracle.getRate(tokens.WETH, tokens.DAI, tokens.USDC, thresholdFilter);
        expect(rate.rate).to.gt(ether('1000'));
    });
});
