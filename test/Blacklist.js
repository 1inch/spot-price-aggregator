const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { ethers } = require('hardhat');
const { expect, deployContract } = require('@1inch/solidity-utils');
const { tokens } = require('./helpers.js');

describe('Blacklist', function () {
    async function initContracts () {
        const [owner, alice] = await ethers.getSigners();
        const blacklist = await deployContract('Blacklist', [owner]);
        return { owner, alice, blacklist };
    }

    it('should revert by non-owner', async function () {
        const { alice, blacklist } = await loadFixture(initContracts);
        await expect(blacklist.connect(alice).toggleBlacklistAddress(tokens.ETH)).to.be.revertedWithCustomError(blacklist, 'OwnableUnauthorizedAccount');
    });

    it('should togle record state', async function () {
        const { owner, blacklist } = await loadFixture(initContracts);
        await blacklist.connect(owner).toggleBlacklistAddress(tokens.ETH);
        expect(await blacklist.blacklisted(tokens.ETH)).to.be.true;
        await blacklist.connect(owner).toggleBlacklistAddress(tokens.ETH);
        expect(await blacklist.blacklisted(tokens.ETH)).to.be.false;
    });
});
