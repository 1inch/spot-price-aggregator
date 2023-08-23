const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { ethers } = require('hardhat');
const { expect, ether, deployContract } = require('@1inch/solidity-utils');
const { tokens } = require('../helpers.js');

describe('SDaiWrapper', function () {
    async function initContracts () {
        const sDaiWrapper = await deployContract('SDaiWrapper', [tokens.DAI, tokens.sDAI]);
        const sDai = await ethers.getContractAt('ISDai', tokens.sDAI);
        return { sDaiWrapper, sDai };
    }

    it('DAI -> sDAI', async function () {
        const { sDaiWrapper, sDai } = await loadFixture(initContracts);
        const response = await sDaiWrapper.wrap(tokens.DAI);
        expect(response.rate).to.equal(await sDai.previewDeposit(ether('1')));
        expect(response.wrappedToken).to.equal(tokens.sDAI);
    });

    it('sDAI -> DAI', async function () {
        const { sDaiWrapper, sDai } = await loadFixture(initContracts);
        const response = await sDaiWrapper.wrap(tokens.sDAI);
        expect(response.rate).to.equal(await sDai.previewRedeem(ether('1')));
        expect(response.wrappedToken).to.equal(tokens.DAI);
    });
});
