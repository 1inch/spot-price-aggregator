const { ethers } = require('hardhat');
const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { expect, ether, deployContract } = require('@1inch/solidity-utils');
const { tokens, deployParams: { AaveWrapperV3 } } = require('../helpers.js');
const { getAllAave3ReservesTokens } = require('../../deploy/utils.js');

describe('AaveWrapperV3', function () {
    async function initContracts () {
        const aaveWrapper = await deployContract('AaveWrapperV3', [AaveWrapperV3.lendingPool]);
        await aaveWrapper.addMarkets([tokens.DAI, tokens.WETH]);
        return { aaveWrapper };
    }

    it('should return all reserves tokens', async function () {
        const tokens = await getAllAave3ReservesTokens(AaveWrapperV3.lendingPool);
        tokens.forEach(token => {
            expect(ethers.isAddress(token)).to.equal(true);
        });
    });

    it('should revert with non-supported token', async function () {
        const { aaveWrapper } = await loadFixture(initContracts);
        const tokens = await getAllAave3ReservesTokens(AaveWrapperV3.lendingPool);
        const token = tokens[tokens.length - 1];
        await expect(aaveWrapper.wrap(token)).to.be.revertedWithCustomError(aaveWrapper, 'NotSupportedToken');
    });

    it('should correct add market', async function () {
        const { aaveWrapper } = await loadFixture(initContracts);
        const aaveV3Reserves = await getAllAave3ReservesTokens(AaveWrapperV3.lendingPool);
        const token = aaveV3Reserves[aaveV3Reserves.length - 1];
        await aaveWrapper.addMarkets([token]);
        const response = await aaveWrapper.wrap(token);
        expect(response.rate).to.equal(ether('1'));
    });

    it('should correct add already added market', async function () {
        const { aaveWrapper } = await loadFixture(initContracts);
        await aaveWrapper.addMarkets([tokens.DAI]);
        const response = await aaveWrapper.wrap(tokens.DAI);
        expect(response.rate).to.equal(ether('1'));
        expect(response.wrappedToken).to.equal(tokens.aDAIV3);
    });

    it('should revert if added market is incorrect', async function () {
        const { aaveWrapper } = await loadFixture(initContracts);
        await expect(aaveWrapper.addMarkets([tokens.aDAIV1])).to.be.revertedWithCustomError(aaveWrapper, 'NotAddedMarket');
    });

    it('should revert if one of added markets is incorrect', async function () {
        const { aaveWrapper } = await loadFixture(initContracts);
        await expect(aaveWrapper.addMarkets([tokens.DAI, tokens.aDAIV1])).to.be.revertedWithCustomError(aaveWrapper, 'NotAddedMarket');
    });

    it('should correct remove market which not support by protocol', async function () {
        const { aaveWrapper } = await loadFixture(initContracts);
        await aaveWrapper.removeMarkets([tokens.aDAIV1]);
        await expect(aaveWrapper.wrap(tokens.aDAIV1)).to.be.revertedWithCustomError(aaveWrapper, 'NotSupportedToken');
    });

    it('should revert if removed market is supported by protocol', async function () {
        const { aaveWrapper } = await loadFixture(initContracts);
        await expect(aaveWrapper.removeMarkets([tokens.DAI])).to.be.revertedWithCustomError(aaveWrapper, 'NotRemovedMarket');
    });

    it('DAI -> aDAI', async function () {
        const { aaveWrapper } = await loadFixture(initContracts);
        const response = await aaveWrapper.wrap(tokens.DAI);
        expect(response.rate).to.equal(ether('1'));
        expect(response.wrappedToken).to.equal(tokens.aDAIV3);
    });

    it('aDAI -> DAI', async function () {
        const { aaveWrapper } = await loadFixture(initContracts);
        const response = await aaveWrapper.wrap(tokens.aDAIV3);
        expect(response.rate).to.equal(ether('1'));
        expect(response.wrappedToken).to.equal(tokens.DAI);
    });

    it('WETH -> aWETH', async function () {
        const { aaveWrapper } = await loadFixture(initContracts);
        const response = await aaveWrapper.wrap(tokens.WETH);
        expect(response.rate).to.equal(ether('1'));
        expect(response.wrappedToken).to.equal(tokens.aWETHV3);
    });

    it('aWETH -> WETH', async function () {
        const { aaveWrapper } = await loadFixture(initContracts);
        const response = await aaveWrapper.wrap(tokens.aWETHV3);
        expect(response.rate).to.equal(ether('1'));
        expect(response.wrappedToken).to.equal(tokens.WETH);
    });
});
