const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { ethers, network } = require('hardhat');
const { expect, ether, deployContract, constants } = require('@1inch/solidity-utils');
const { tokens } = require('../helpers.js');
const { resetHardhatNetworkFork } = require('@1inch/solidity-utils/hardhat-setup');

describe('Erc4626Wrapper', function () {
    async function initContracts () {
        const [owner, alice] = await ethers.getSigners();
        const erc4626Wrapper = await deployContract('Erc4626Wrapper', [owner]);
        return { owner, alice, erc4626Wrapper };
    }

    it('should add market via addMarkets and remove market via removeMarkets', async function () {
        const { erc4626Wrapper } = await loadFixture(initContracts);
        await erc4626Wrapper.addMarkets([tokens.sUSDe]);
        expect(await erc4626Wrapper.wbaseToBase(tokens.sUSDe)).to.equal(tokens.USDe);
        expect(await erc4626Wrapper.baseToWbase(tokens.USDe)).to.equal(tokens.sUSDe);

        await erc4626Wrapper.removeMarkets([tokens.sUSDe]);
        expect(await erc4626Wrapper.wbaseToBase(tokens.sUSDe)).to.equal(constants.ZERO_ADDRESS);
        expect(await erc4626Wrapper.baseToWbase(tokens.USDe)).to.equal(constants.ZERO_ADDRESS);
    });

    it('should not add market by non-owner', async function () {
        const { alice, erc4626Wrapper } = await loadFixture(initContracts);
        await expect(erc4626Wrapper.connect(alice).addMarkets([tokens.sUSDe])).to.be.revertedWithCustomError(erc4626Wrapper, 'OwnableUnauthorizedAccount');
    });

    it('should not remove market by non-owner', async function () {
        const { alice, erc4626Wrapper } = await loadFixture(initContracts);
        await expect(erc4626Wrapper.connect(alice).removeMarkets([tokens.sUSDe])).to.be.revertedWithCustomError(erc4626Wrapper, 'OwnableUnauthorizedAccount');
    });

    it('should not return result in wrap method for unsupported token', async function () {
        const { erc4626Wrapper } = await loadFixture(initContracts);
        await expect(erc4626Wrapper.wrap(tokens.WETH)).to.be.revertedWithCustomError(erc4626Wrapper, 'NotSupportedToken');
    });

    describe('sUSDe Wrapper', function () {
        async function initContractsAndMarket () {
            const { erc4626Wrapper } = await initContracts();
            const sUSDe = await ethers.getContractAt('IERC4626', tokens.sUSDe);
            await erc4626Wrapper.addMarkets([sUSDe]);
            return { erc4626Wrapper, sUSDe };
        }

        it('USDe -> sUSDe', async function () {
            const { erc4626Wrapper, sUSDe } = await loadFixture(initContractsAndMarket);
            const response = await erc4626Wrapper.wrap(tokens.USDe);
            expect(response.rate).to.equal(await sUSDe.convertToShares(ether('1')));
            expect(response.wrappedToken).to.equal(tokens.sUSDe);
        });

        it('sUSDe -> USDe', async function () {
            const { erc4626Wrapper, sUSDe } = await loadFixture(initContractsAndMarket);
            const response = await erc4626Wrapper.wrap(tokens.sUSDe);
            expect(response.rate).to.equal(await sUSDe.convertToAssets(ether('1')));
            expect(response.wrappedToken).to.equal(tokens.USDe);
        });
    });

    describe('sDAI Wrapper', function () {
        async function initContractsAndMarket () {
            const { erc4626Wrapper } = await initContracts();
            const sDai = await ethers.getContractAt('IERC4626', tokens.sDAI);
            await erc4626Wrapper.addMarkets([sDai]);
            return { erc4626Wrapper, sDai };
        }

        it('DAI -> sDai', async function () {
            const { erc4626Wrapper, sDai } = await loadFixture(initContractsAndMarket);
            const response = await erc4626Wrapper.wrap(tokens.DAI);
            expect(response.rate).to.equal(await sDai.convertToShares(ether('1')));
            expect(response.wrappedToken).to.equal(tokens.sDAI);
        });

        it('sDai -> DAI', async function () {
            const { erc4626Wrapper, sDai } = await loadFixture(initContractsAndMarket);
            const response = await erc4626Wrapper.wrap(tokens.sDAI);
            expect(response.rate).to.equal(await sDai.convertToAssets(ether('1')));
            expect(response.wrappedToken).to.equal(tokens.DAI);
        });
    });

    describe('wsuperOETHb Wrapper', function () {
        before(async function () {
            await resetHardhatNetworkFork(network, 'base');
        });

        after(async function () {
            await resetHardhatNetworkFork(network, 'mainnet');
        });

        async function initContractsAndMarket () {
            const { erc4626Wrapper } = await initContracts();
            const wsuperOETHb = await ethers.getContractAt('IERC4626', tokens.base.wsuperOETHb);
            await erc4626Wrapper.addMarkets([wsuperOETHb]);
            return { erc4626Wrapper, wsuperOETHb };
        }

        it('superOETHb -> wsuperOETHb', async function () {
            const { erc4626Wrapper, wsuperOETHb } = await loadFixture(initContractsAndMarket);
            const response = await erc4626Wrapper.wrap(tokens.base.superOETHb);
            expect(response.rate).to.equal(await wsuperOETHb.convertToShares(ether('1')));
            expect(response.wrappedToken).to.equal(tokens.base.wsuperOETHb);
        });

        it('wsuperOETHb -> superOETHb', async function () {
            const { erc4626Wrapper, wsuperOETHb } = await loadFixture(initContractsAndMarket);
            const response = await erc4626Wrapper.wrap(tokens.base.wsuperOETHb);
            expect(response.rate).to.equal(await wsuperOETHb.convertToAssets(ether('1')));
            expect(response.wrappedToken).to.equal(tokens.base.superOETHb);
        });
    });
});
