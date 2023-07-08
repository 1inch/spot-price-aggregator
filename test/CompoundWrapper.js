const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { expect, ether, deployContract } = require('@1inch/solidity-utils');
const { tokens, deployParams: { CompoundWrapper } } = require('./helpers.js');

describe('CompoundWrapper', function () {
    async function initContracts () {
        const compoundWrapper = await deployContract('CompoundLikeWrapper', [CompoundWrapper.comptroller, tokens.cETH]);
        await compoundWrapper.addMarkets([tokens.cDAI]);
        return { compoundWrapper };
    }

    it('dai -> cdai', async function () {
        const { compoundWrapper } = await loadFixture(initContracts);
        const response = await compoundWrapper.wrap(tokens.DAI);
        expect(response.rate).to.lt('5000000000');
        expect(response.wrappedToken).to.equal(tokens.cDAI);
    });

    it('cdai -> dai', async function () {
        const { compoundWrapper } = await loadFixture(initContracts);
        const response = await compoundWrapper.wrap(tokens.cDAI);
        expect(response.rate).to.gt(ether('200000000'));
        expect(response.wrappedToken).to.equal(tokens.DAI);
    });

    it('eth -> ceth', async function () {
        const { compoundWrapper } = await loadFixture(initContracts);
        const response = await compoundWrapper.wrap(tokens.ETH);
        expect(response.rate).to.lt('5000000000');
        expect(response.wrappedToken).to.equal(tokens.cETH);
    });

    it('ceth -> eth', async function () {
        const { compoundWrapper } = await loadFixture(initContracts);
        const response = await compoundWrapper.wrap(tokens.cETH);
        expect(response.rate).to.gt(ether('200000000'));
        expect(response.wrappedToken).to.equal(tokens.ETH);
    });
});
