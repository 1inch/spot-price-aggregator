const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { ethers } = require('hardhat');
const { expect, ether, deployContract } = require('@1inch/solidity-utils');
const { tokens } = require('../helpers.js');

describe('SUSDeWrapper', function () {
    async function initContracts () {
        const sUSDeWrapper = await deployContract('SUSDeWrapper', [tokens.USDe, tokens.sUSDe]);
        const sUSDe = await ethers.getContractAt('IERC4626', tokens.sUSDe);
        return { sUSDeWrapper, sUSDe };
    }

    it('USDe -> sUSDe', async function () {
        const { sUSDeWrapper, sUSDe } = await loadFixture(initContracts);
        const response = await sUSDeWrapper.wrap(tokens.USDe);
        expect(response.rate).to.equal(await sUSDe.convertToShares(ether('1')));
        expect(response.wrappedToken).to.equal(tokens.sUSDe);
    });

    it('sUSDe -> USDe', async function () {
        const { sUSDeWrapper, sUSDe } = await loadFixture(initContracts);
        const response = await sUSDeWrapper.wrap(tokens.sUSDe);
        expect(response.rate).to.equal(await sUSDe.convertToAssets(ether('1')));
        expect(response.wrappedToken).to.equal(tokens.USDe);
    });
});
