const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { expect, ether, deployContract } = require('@1inch/solidity-utils');
const {
    tokens,
    deployParams: { Mooniswap },
    defaultValues: { thresholdFilter },
} = require('./helpers.js');

describe('MooniswapOracle', function () {
    async function initContracts () {
        const mooniswapOracle = await deployContract('MooniswapOracle', [Mooniswap.factory]);
        return { mooniswapOracle };
    }

    it('eth -> dai', async function () {
        const { mooniswapOracle } = await loadFixture(initContracts);
        const rate = await mooniswapOracle.getRate(tokens.ETH, tokens.DAI, tokens.NONE, thresholdFilter);
        expect(rate.rate).to.gt(ether('1000'));
    });

    it('eth -> usdc -> 1inch', async function () {
        const { mooniswapOracle } = await loadFixture(initContracts);
        const rate = await mooniswapOracle.getRate(tokens.ETH, tokens['1INCH'], tokens.USDC, thresholdFilter);
        expect(rate.rate).to.gt(ether('200'));
    });
});
