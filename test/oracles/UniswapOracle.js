const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { expect, ether, deployContract } = require('@1inch/solidity-utils');
const {
    tokens,
    deployParams: { Uniswap },
    defaultValues: { thresholdFilter },
} = require('../helpers.js');

describe('UniswapOracle', function () {
    async function initContracts () {
        const uniswapOracle = await deployContract('UniswapOracle', [Uniswap.factory]);
        return { uniswapOracle };
    }

    it('WETH -> ETH -> DAI', async function () {
        const { uniswapOracle } = await loadFixture(initContracts);
        const rate = await uniswapOracle.getRate(tokens.WETH, tokens.DAI, tokens.ETH, thresholdFilter);
        expect(rate.rate).to.gt(ether('1000'));
    });

    it('ETH -> DAI', async function () {
        const { uniswapOracle } = await loadFixture(initContracts);
        const rate = await uniswapOracle.getRate(tokens.ETH, tokens.DAI, tokens.NONE, thresholdFilter);
        expect(rate.rate).to.gt(ether('1000'));
    });

    it('DAI -> ETH', async function () {
        const { uniswapOracle } = await loadFixture(initContracts);
        const rate = await uniswapOracle.getRate(tokens.DAI, tokens.ETH, tokens.NONE, thresholdFilter);
        expect(rate.rate).to.lt(ether('0.001'));
    });
});
