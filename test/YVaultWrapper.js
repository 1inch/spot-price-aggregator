const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { expect, ether, deployContract } = require('@1inch/solidity-utils');
const { tokens } = require('./helpers.js');

describe('YVaultWrapper', function () {
    async function initContracts () {
        const yvaultWrapper = await deployContract('YVaultWrapper');
        return { yvaultWrapper };
    }

    it('ylink -> alink', async function () {
        const { yvaultWrapper } = await loadFixture(initContracts);
        const response = await yvaultWrapper.wrap(tokens.yaLINK);
        expect(response.rate).to.gt(ether('1'));
        expect(response.wrappedToken).to.equal(tokens.aLINK);
    });

    it('yweth -> weth', async function () {
        const { yvaultWrapper } = await loadFixture(initContracts);
        const response = await yvaultWrapper.wrap(tokens.yvWETH);
        expect(response.rate).to.gt(ether('1'));
        expect(response.wrappedToken).to.equal(tokens.WETH);
    });

    it('ywbtc -> wbtc', async function () {
        const { yvaultWrapper } = await loadFixture(initContracts);
        const response = await yvaultWrapper.wrap(tokens.yvWBTC);
        expect(response.rate).to.gt(ether('1'));
        expect(response.wrappedToken).to.equal(tokens.WBTC);
    });
});
