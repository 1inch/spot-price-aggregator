const hre = require('hardhat');
const { ethers } = hre;
const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { expect, ether, deployContract, trackReceivedTokenAndTx, assertRoughlyEqualValues } = require('@1inch/solidity-utils');
const { tokens } = require('../helpers.js');

describe('BaseCoinWrapper', function () {
    async function initContracts () {
        const baseCoinWrapper = await deployContract('BaseCoinWrapper', [tokens.ETH, tokens.WETH]);
        return { baseCoinWrapper };
    }

    it('ETH -> WETH', async function () {
        const { baseCoinWrapper } = await loadFixture(initContracts);
        const response = await baseCoinWrapper.wrap(tokens.ETH);
        expect(response.rate).to.equal(ether('1'));
        expect(response.wrappedToken).to.equal(tokens.WETH);
    });

    it('WETH -> ETH', async function () {
        const { baseCoinWrapper } = await loadFixture(initContracts);
        const response = await baseCoinWrapper.wrap(tokens.WETH);
        expect(response.rate).to.equal(ether('1'));
        expect(response.wrappedToken).to.equal(tokens.ETH);
    });
});

describe('CompoundV3Wrapper', function () {
    const COMETABI = [
        'function supply(address asset, uint amount) external',
        'function withdraw(address asset, uint amount) external',
    ];

    async function initContracts () {
        const [wallet] = await ethers.getSigners();
        const baseCoinWrapper = await deployContract('BaseCoinWrapper', [tokens.WETH, tokens.cWETHv3]);

        const IERC20ABI = (await hre.artifacts.readArtifact('IERC20')).abi;
        const cWETHv3 = new ethers.Contract(tokens.cWETHv3, [...IERC20ABI, ...COMETABI], wallet);
        const weth = await ethers.getContractAt('IWETH', tokens.WETH);

        await weth.deposit({ value: ether('2') });
        await weth.approve(cWETHv3, ether('2'));

        return { wallet, baseCoinWrapper, weth, cWETHv3 };
    }

    it('WETH -> cWETHv3', async function () {
        const { wallet, baseCoinWrapper, cWETHv3 } = await loadFixture(initContracts);
        const response = await baseCoinWrapper.wrap(tokens.WETH);
        const [received] = await trackReceivedTokenAndTx(ethers.provider, cWETHv3, wallet.address, async () => cWETHv3.supply(tokens.WETH, ether('1')));
        expect(response.wrappedToken).to.equal(tokens.cWETHv3);
        assertRoughlyEqualValues(response.rate, received, 1e-17);
    });

    it('cWETHv3 -> WETH', async function () {
        const { wallet, baseCoinWrapper, weth, cWETHv3 } = await loadFixture(initContracts);
        await cWETHv3.supply(tokens.WETH, ether('2'));
        const response = await baseCoinWrapper.wrap(tokens.cWETHv3);
        const [received] = await trackReceivedTokenAndTx(ethers.provider, weth, wallet.address, async () => cWETHv3.withdraw(tokens.WETH, ether('1')));
        expect(response.wrappedToken).to.equal(tokens.WETH);
        assertRoughlyEqualValues(response.rate, received, 1e-17);
    });
});
