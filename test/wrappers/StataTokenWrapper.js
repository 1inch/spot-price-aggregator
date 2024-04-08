const { ethers } = require('hardhat');
const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { expect, ether, deployContract, assertRoughlyEqualValues } = require('@1inch/solidity-utils');
const { tokens, deployParams: { StataTokenWrapper } } = require('../helpers.js');
const { getAllAaveV3UnderlyingTokensForStataTokens } = require('../../deploy/utils.js');

describe('StataTokenWrapper', function () {
    const stataTokenABI = [
        {
            name: 'previewDeposit',
            type: 'function',
            inputs: [{ type: 'uint256', name: 'assets' }],
            outputs: [{ type: 'uint256', name: 'value' }],
            stateMutability: 'view',
        },
        {
            name: 'previewWithdraw',
            type: 'function',
            inputs: [{ type: 'uint256', name: 'assets' }],
            outputs: [{ type: 'uint256', name: 'value' }],
            stateMutability: 'view',
        },
    ];

    async function initContracts () {
        const stataTokenWrapper = await deployContract('StataTokenWrapper', [StataTokenWrapper.staticATokenFactory]);
        await stataTokenWrapper.addMarkets([tokens.USDC, tokens.WETH]);
        const stataTokens = {
            USDC: await ethers.getContractAt(stataTokenABI, tokens.stataUSDC),
            WETH: await ethers.getContractAt(stataTokenABI, tokens.stataWETH),
            DAI: await ethers.getContractAt(stataTokenABI, tokens.stataDAI),
        };
        return { stataTokens, stataTokenWrapper };
    }

    it('should retrun underlying tokens for all stata tokens', async function () {
        const tokens = await getAllAaveV3UnderlyingTokensForStataTokens(StataTokenWrapper.staticATokenFactory);
        const factory = await ethers.getContractAt('IStaticATokenFactory', StataTokenWrapper.staticATokenFactory);
        const allStataTokens = await factory.getStaticATokens();
        expect(tokens.length).to.equal(allStataTokens.length);
        for (const token of tokens) {
            const stataToken = await factory.getStaticAToken(token);
            expect(allStataTokens.indexOf(stataToken) !== -1).to.equal(true);
        }
    });

    it('should revert with non-supported token', async function () {
        const { stataTokenWrapper } = await loadFixture(initContracts);
        await expect(stataTokenWrapper.wrap(tokens.CHAI)).to.be.revertedWithCustomError(stataTokenWrapper, 'NotSupportedToken');
    });

    it('should correct add market', async function () {
        const { stataTokens, stataTokenWrapper } = await loadFixture(initContracts);
        await stataTokenWrapper.addMarkets([tokens.DAI]);
        const response = await stataTokenWrapper.wrap(tokens.DAI);
        assertRoughlyEqualValues(await stataTokens.DAI.previewDeposit(ether('1')), response.rate, 1e8);
    });

    it('should correct add already added market', async function () {
        const { stataTokens, stataTokenWrapper } = await loadFixture(initContracts);
        await stataTokenWrapper.addMarkets([tokens.USDC]);
        const response = await stataTokenWrapper.wrap(tokens.USDC);
        expect(await stataTokens.USDC.previewDeposit(ether('1'))).to.equal(response.rate);
    });

    it('should revert if added market is incorrect', async function () {
        const { stataTokenWrapper } = await loadFixture(initContracts);
        await expect(stataTokenWrapper.addMarkets([tokens.CHAI])).to.be.revertedWithCustomError(stataTokenWrapper, 'NotAddedMarket');
    });

    it('should revert if one of added markets is incorrect', async function () {
        const { stataTokenWrapper } = await loadFixture(initContracts);
        await expect(stataTokenWrapper.addMarkets([tokens.DAI, tokens.CHAI])).to.be.revertedWithCustomError(stataTokenWrapper, 'NotAddedMarket');
    });

    it('should correct remove market', async function () {
        const { stataTokenWrapper } = await loadFixture(initContracts);
        await stataTokenWrapper.removeMarkets([tokens.USDC]);
        await expect(stataTokenWrapper.wrap(tokens.USDC)).to.be.revertedWithCustomError(stataTokenWrapper, 'NotSupportedToken');
    });

    it('should revert if removed market is incorrect', async function () {
        const { stataTokenWrapper } = await loadFixture(initContracts);
        await expect(stataTokenWrapper.removeMarkets([tokens.CHAI])).to.be.revertedWithCustomError(stataTokenWrapper, 'NotRemovedMarket');
    });

    it('USDC -> stataUSDC', async function () {
        const { stataTokens, stataTokenWrapper } = await loadFixture(initContracts);
        const response = await stataTokenWrapper.wrap(tokens.USDC);
        expect(response.rate).to.equal(await stataTokens.USDC.previewDeposit(ether('1')));
        expect(response.wrappedToken).to.equal(tokens.stataUSDC);
    });

    it('stataUSDC -> USDC', async function () {
        const { stataTokens, stataTokenWrapper } = await loadFixture(initContracts);
        const response = await stataTokenWrapper.wrap(tokens.stataUSDC);
        assertRoughlyEqualValues(await stataTokens.USDC.previewWithdraw(ether('1')), response.rate, 1e10);
        expect(response.wrappedToken).to.equal(tokens.USDC);
    });

    it('WETH -> stataWETH', async function () {
        const { stataTokens, stataTokenWrapper } = await loadFixture(initContracts);
        const response = await stataTokenWrapper.wrap(tokens.WETH);
        expect(response.rate).to.equal(await stataTokens.WETH.previewDeposit(ether('1')));
        expect(response.wrappedToken).to.equal(tokens.stataWETH);
    });

    it('stataWETH -> WETH', async function () {
        const { stataTokens, stataTokenWrapper } = await loadFixture(initContracts);
        const response = await stataTokenWrapper.wrap(tokens.stataWETH);
        assertRoughlyEqualValues(await stataTokens.WETH.previewWithdraw(ether('1')), response.rate, 1e10);
        expect(response.wrappedToken).to.equal(tokens.WETH);
    });
});
