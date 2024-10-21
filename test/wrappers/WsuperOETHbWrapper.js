const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { ethers, network } = require('hardhat');
const { expect, ether, deployContract } = require('@1inch/solidity-utils');
const { resetHardhatNetworkFork } = require('@1inch/solidity-utils/hardhat-setup');
const { tokens } = require('../helpers.js');

describe('WsuperOETHbWrapper', function () {
    before(async function () {
        await resetHardhatNetworkFork(network, 'base');
    });

    after(async function () {
        await resetHardhatNetworkFork(network, 'mainnet');
    });

    async function initContracts () {
        const wsuperOETHbWrapper = await deployContract('WsuperOETHbWrapper', [tokens.base.superOETHb, tokens.base.wsuperOETHb]);
        const wsuperOETHb = await ethers.getContractAt('ISDai', tokens.base.wsuperOETHb);
        return { wsuperOETHbWrapper, wsuperOETHb };
    }

    it('superOETHb -> wsuperOETHb', async function () {
        const { wsuperOETHbWrapper, wsuperOETHb } = await loadFixture(initContracts);
        const response = await wsuperOETHbWrapper.wrap(tokens.base.superOETHb);
        expect(response.rate).to.equal(await wsuperOETHb.previewDeposit(ether('1')));
        expect(response.wrappedToken).to.equal(tokens.base.wsuperOETHb);
    });

    it('wsuperOETHb -> superOETHb', async function () {
        const { wsuperOETHbWrapper, wsuperOETHb } = await loadFixture(initContracts);
        const response = await wsuperOETHbWrapper.wrap(tokens.base.wsuperOETHb);
        expect(response.rate).to.equal(await wsuperOETHb.previewRedeem(ether('1')));
        expect(response.wrappedToken).to.equal(tokens.base.superOETHb);
    });
});
