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

    it('should add market via addMarketsManually and remove market via removeMarkets', async function () {
        const { erc4626Wrapper } = await loadFixture(initContracts);
        await erc4626Wrapper.addMarketsManually([[tokens.USDe, tokens.sUSDe]]);
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

    function shouldReturnCorrectPricesAndTokens (fixture) {
        it('base -> wbase', async function () {
            const { erc4626Wrapper, wbase, base } = await loadFixture(fixture);
            const response = await erc4626Wrapper.wrap(base);
            expect(response.rate).to.equal(await wbase.convertToShares(ether('1')));
            expect(response.wrappedToken).to.equal(wbase.target);
        });

        it('wbase -> base', async function () {
            const { erc4626Wrapper, wbase, base } = await loadFixture(fixture);
            const response = await erc4626Wrapper.wrap(wbase);
            expect(response.rate).to.equal(await wbase.convertToAssets(ether('1')));
            expect(response.wrappedToken).to.equal(base);
        });
    };

    describe('sUSDe Wrapper', function () {
        async function initContractsAndMarket () {
            const { erc4626Wrapper } = await initContracts();
            const sUSDe = await ethers.getContractAt('IERC4626', tokens.sUSDe);
            await erc4626Wrapper.addMarkets([sUSDe]);
            return { erc4626Wrapper, wbase: sUSDe, base: tokens.USDe };
        }
        shouldReturnCorrectPricesAndTokens(initContractsAndMarket);
    });

    describe('sDAI Wrapper', function () {
        async function initContractsAndMarket () {
            const { erc4626Wrapper } = await initContracts();
            const sDai = await ethers.getContractAt('IERC4626', tokens.sDAI);
            await erc4626Wrapper.addMarkets([sDai]);
            return { erc4626Wrapper, wbase: sDai, base: tokens.DAI };
        }
        shouldReturnCorrectPricesAndTokens(initContractsAndMarket);
    });

    describe('xrETH Wrapper', function () {
        async function initContractsAndMarket () {
            const { erc4626Wrapper } = await initContracts();
            const xrETH = await ethers.getContractAt('IERC4626', tokens.xrETH);
            await erc4626Wrapper.addMarkets([xrETH]);
            return { erc4626Wrapper, wbase: xrETH, base: tokens.WETH };
        }

        // Switch off console.log to avoid spamming the console with the logs from the xrETH contract
        const originalConsoleLog = console.log;
        before(async function () { console.log = function () {}; });
        after(async function () { console.log = originalConsoleLog; });

        shouldReturnCorrectPricesAndTokens(initContractsAndMarket);
    });

    describe('scrvUSD Wrapper', function () {
        async function initContractsAndMarket () {
            const { erc4626Wrapper } = await initContracts();
            const scrvUSD = await ethers.getContractAt('IERC4626', tokens.scrvUSD);
            await erc4626Wrapper.addMarkets([scrvUSD]);
            return { erc4626Wrapper, wbase: scrvUSD, base: tokens.crvUSD };
        }
        shouldReturnCorrectPricesAndTokens(initContractsAndMarket);
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
            return { erc4626Wrapper, wbase: wsuperOETHb, base: tokens.base.superOETHb };
        }
        shouldReturnCorrectPricesAndTokens(initContractsAndMarket);
    });
});
