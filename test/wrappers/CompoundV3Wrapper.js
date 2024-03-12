const hre = require('hardhat');
const { ethers } = hre;
const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { expect, ether, deployContract, trackReceivedTokenAndTx, assertRoughlyEqualValues, constants } = require('@1inch/solidity-utils');
const { tokens } = require('../helpers.js');

describe('CompoundV3Wrapper', function () {
    async function initContracts () {
        const [wallet, nonOwner] = await ethers.getSigners();
        const compoundV3Wrapper = await deployContract('CompoundV3Wrapper', [wallet]);

        const IERC20ABI = (await hre.artifacts.readArtifact('IERC20')).abi;
        const COMETABI = (await hre.artifacts.readArtifact('IComet')).abi;
        const cWETHv3 = new ethers.Contract(tokens.cWETHv3, [...IERC20ABI, ...COMETABI], wallet);
        const weth = await ethers.getContractAt('IWETH', tokens.WETH);

        await compoundV3Wrapper.addMarkets([tokens.cWETHv3]);
        await weth.deposit({ value: ether('2') });
        await weth.approve(cWETHv3, ether('2'));

        return { wallet, nonOwner, compoundV3Wrapper, weth, cWETHv3 };
    }

    it('should revert when add/remove by non-owner', async function () {
        const { nonOwner, compoundV3Wrapper } = await loadFixture(initContracts);
        await expect(compoundV3Wrapper.connect(nonOwner).addMarkets([tokens.cUSDCv3])).to.be.revertedWithCustomError(compoundV3Wrapper, 'OwnableUnauthorizedAccount');
        await expect(compoundV3Wrapper.connect(nonOwner).removeMarkets([tokens.cWETHv3])).to.be.revertedWithCustomError(compoundV3Wrapper, 'OwnableUnauthorizedAccount');
    });

    it('addMarkets', async function () {
        const { compoundV3Wrapper } = await loadFixture(initContracts);
        await compoundV3Wrapper.addMarkets([tokens.cUSDCv3]);
        expect(await compoundV3Wrapper.cTokenToToken(tokens.cUSDCv3)).to.equal(tokens.USDC);
        expect(await compoundV3Wrapper.tokenTocToken(tokens.USDC)).to.equal(tokens.cUSDCv3);
    });

    it('removeMarkets', async function () {
        const { compoundV3Wrapper } = await loadFixture(initContracts);
        await compoundV3Wrapper.removeMarkets([tokens.cWETHv3]);
        expect(await compoundV3Wrapper.cTokenToToken(tokens.cWETHv3)).to.equal(constants.ZERO_ADDRESS);
        expect(await compoundV3Wrapper.tokenTocToken(tokens.WETH)).to.equal(constants.ZERO_ADDRESS);
    });

    it('WETH -> cWETHv3', async function () {
        const { wallet, compoundV3Wrapper, cWETHv3 } = await loadFixture(initContracts);
        const response = await compoundV3Wrapper.wrap(tokens.WETH);
        const [received] = await trackReceivedTokenAndTx(ethers.provider, cWETHv3, wallet.address, async () => cWETHv3.supply(tokens.WETH, ether('1')));
        expect(response.wrappedToken).to.equal(tokens.cWETHv3);
        assertRoughlyEqualValues(response.rate, received, 1e-17);
    });

    it('cWETHv3 -> WETH', async function () {
        const { wallet, compoundV3Wrapper, weth, cWETHv3 } = await loadFixture(initContracts);
        await cWETHv3.supply(tokens.WETH, ether('2'));
        const response = await compoundV3Wrapper.wrap(tokens.cWETHv3);
        const [received] = await trackReceivedTokenAndTx(ethers.provider, weth, wallet.address, async () => cWETHv3.withdraw(tokens.WETH, ether('1')));
        expect(response.wrappedToken).to.equal(tokens.WETH);
        assertRoughlyEqualValues(response.rate, received, 1e-17);
    });
});
