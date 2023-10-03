const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { ethers } = require('hardhat');
const { expect, ether, deployContract, assertRoughlyEqualValues, trackReceivedTokenAndTx } = require('@1inch/solidity-utils');
const { tokens, contracts } = require('../helpers.js');

describe('ChaiWrapper', function () {
    async function initContracts () {
        const chaiWrapper = await deployContract('ChaiWrapper', [tokens.DAI, tokens.CHAI, contracts.chaiPot]);
        const chai = await ethers.getContractAt('IChai', tokens.CHAI);
        // Buy DAI using UNI-V1 pool
        const [wallet] = await ethers.getSigners();
        await wallet.sendTransaction({ to: '0x2a1530c4c41db0b0b2bb646cb5eb1a67b7158667', value: ether('1') });
        // Buy CHAI using DAI
        const dai = await ethers.getContractAt('IERC20', tokens.DAI);
        await dai.approve(chai.address, ether('3'));
        await chai.join(wallet.address, ether('2'));
        return { wallet, chaiWrapper, chai, dai };
    }

    it('DAI -> CHAI', async function () {
        const { wallet, chaiWrapper, chai } = await loadFixture(initContracts);
        const response = await chaiWrapper.wrap(tokens.DAI);
        const [received] = await trackReceivedTokenAndTx(ethers.provider, chai, wallet.address, async () => chai.join(wallet.address, ether('1')));
        expect(response.wrappedToken).to.equal(tokens.CHAI);
        assertRoughlyEqualValues(response.rate, received, 1e-6);
    });

    it('CHAI -> DAI', async function () {
        const { wallet, chaiWrapper, chai, dai } = await loadFixture(initContracts);
        const response = await chaiWrapper.wrap(tokens.CHAI);
        const [received] = await trackReceivedTokenAndTx(ethers.provider, dai, wallet.address, async () => chai.exit(wallet.address, ether('1')));
        expect(response.wrappedToken).to.equal(tokens.DAI);
        assertRoughlyEqualValues(response.rate, received, 1e-6);
    });
});
