const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { expect, ether, deployContract } = require('@1inch/solidity-utils');
const { tokens } = require('../helpers.js');

describe('BaseCoinWrapper', function () {
    async function initContracts () {
        const baseCoinWrapper = await deployContract('BaseCoinWrapper', [tokens.ETH, tokens.WETH]);
        return { baseCoinWrapper };
    }

    it('ETH -> WETH', async function () {
        const { baseCoinWrapper } = await loadFixture(initContracts);
        const response = await baseCoinWrapper.wrap(tokens.ETH);
        expect(response.rate).to.equal(ether('1'));
        expect(response.wrappedToken).to.equal(tokens.WETH);
    });

    it('WETH -> ETH', async function () {
        const { baseCoinWrapper } = await loadFixture(initContracts);
        const response = await baseCoinWrapper.wrap(tokens.WETH);
        expect(response.rate).to.equal(ether('1'));
        expect(response.wrappedToken).to.equal(tokens.ETH);
    });
});
