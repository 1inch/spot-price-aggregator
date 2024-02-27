const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { expect, ether, deployContract } = require('@1inch/solidity-utils');
const { tokens } = require('../helpers.js');

describe('YVaultWrapper', function () {
    async function initContracts () {
        const yvaultWrapper = await deployContract('YVaultWrapper');
        return { yvaultWrapper };
    }

    it('yLINK -> aLINK', async function () {
        const { yvaultWrapper } = await loadFixture(initContracts);
        const response = await yvaultWrapper.wrap(tokens.yaLINK);
        expect(response.rate).to.gt(ether('1'));
        expect(response.wrappedToken).to.equal(tokens.aLINK);
    });

    it('yWETH -> WETH', async function () {
        const { yvaultWrapper } = await loadFixture(initContracts);
        const response = await yvaultWrapper.wrap(tokens.yvWETH);
        expect(response.rate).to.gt(ether('1'));
        expect(response.wrappedToken).to.equal(tokens.WETH);
    });

    it('yWBTC -> WBTC', async function () {
        const { yvaultWrapper } = await loadFixture(initContracts);
        const response = await yvaultWrapper.wrap(tokens.yvWBTC);
        expect(response.rate).to.gt(ether('1'));
        expect(response.wrappedToken).to.equal(tokens.WBTC);
    });
});
