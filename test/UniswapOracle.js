const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { expect, ether, deployContract } = require('@1inch/solidity-utils');
const { tokens } = require('./helpers.js');

describe('UniswapOracle', function () {
    async function initContracts () {
        const uniswapOracle = await deployContract('UniswapOracle', ['0xc0a47dFe034B400B47bDaD5FecDa2621de6c4d95']);
        return { uniswapOracle };
    }

    it('weth -> dai', async function () {
        const { uniswapOracle } = await loadFixture(initContracts);
        const rate = await uniswapOracle.getRate(tokens.WETH, tokens.DAI, tokens.ETH);
        expect(rate.rate).to.gt(ether('1000'));
    });

    it('eth -> dai', async function () {
        const { uniswapOracle } = await loadFixture(initContracts);
        const rate = await uniswapOracle.getRate(tokens.ETH, tokens.DAI, tokens.NONE);
        expect(rate.rate).to.gt(ether('1000'));
    });

    it('dai -> eth', async function () {
        const { uniswapOracle } = await loadFixture(initContracts);
        const rate = await uniswapOracle.getRate(tokens.DAI, tokens.ETH, tokens.NONE);
        expect(rate.rate).to.lt(ether('0.001'));
    });
});
