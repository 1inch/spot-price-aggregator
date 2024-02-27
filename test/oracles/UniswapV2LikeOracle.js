const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { expect, ether, deployContract } = require('@1inch/solidity-utils');
const {
    tokens,
    deployParams: { ShibaSwap, UniswapV2 },
    defaultValues: { thresholdFilter },
} = require('../helpers.js');

describe('UniswapV2LikeOracle', function () {
    describe('UniswapV2', function () {
        async function initContracts () {
            const uniswapV2Oracle = await deployContract('UniswapV2LikeOracle', [UniswapV2.factory, UniswapV2.initcodeHash]);
            return { uniswapV2Oracle };
        }

        it('WETH -> DAI', async function () {
            const { uniswapV2Oracle } = await loadFixture(initContracts);
            const rate = await uniswapV2Oracle.getRate(tokens.WETH, tokens.DAI, tokens.NONE, thresholdFilter);
            expect(rate.rate).to.gt(ether('1000'));
        });

        it('WETH -> USDC -> DAI', async function () {
            const { uniswapV2Oracle } = await loadFixture(initContracts);
            const rate = await uniswapV2Oracle.getRate(tokens.WETH, tokens.DAI, tokens.USDC, thresholdFilter);
            expect(rate.rate).to.gt(ether('1000'));
        });
    });

    describe('Shibaswap', function () {
        async function initContracts () {
            const shibaswapOracle = await deployContract('UniswapV2LikeOracle', [ShibaSwap.factory, ShibaSwap.initcodeHash]);
            return { shibaswapOracle };
        }

        it('WETH -> DAI', async function () {
            const { shibaswapOracle } = await loadFixture(initContracts);
            const rate = await shibaswapOracle.getRate(tokens.WETH, tokens.DAI, tokens.NONE, thresholdFilter);
            expect(rate.rate).to.gt(ether('1000'));
        });

        it('WETH -> USDC -> DAI', async function () {
            const { shibaswapOracle } = await loadFixture(initContracts);
            const rate = await shibaswapOracle.getRate(tokens.WETH, tokens.DAI, tokens.USDC, thresholdFilter);
            expect(rate.rate).to.gt(ether('1000'));
        });
    });
});
