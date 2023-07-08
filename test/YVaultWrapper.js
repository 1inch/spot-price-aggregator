const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { expect, ether, deployContract } = require('@1inch/solidity-utils');
const { tokens } = require('./helpers.js');

const YLINKV1 = '0x29E240CFD7946BA20895a7a02eDb25C210f9f324';
const ALINK = '0xA64BD6C70Cb9051F6A9ba1F163Fdc07E0DfB5F84';
const YWETHV2 = '0xa258C4606Ca8206D8aA700cE2143D7db854D168c';
const YWBTCV2 = '0xA696a63cc78DfFa1a63E9E50587C197387FF6C7E';

describe('YVaultWrapper', function () {
    async function initContracts () {
        const yvaultWrapper = await deployContract('YVaultWrapper');
        return { yvaultWrapper };
    }

    it('ylink -> alink', async function () {
        const { yvaultWrapper } = await loadFixture(initContracts);
        const response = await yvaultWrapper.wrap(YLINKV1);
        expect(response.rate).to.gt(ether('1'));
        expect(response.wrappedToken).to.equal(ALINK);
    });

    it('yweth -> weth', async function () {
        const { yvaultWrapper } = await loadFixture(initContracts);
        const response = await yvaultWrapper.wrap(YWETHV2);
        expect(response.rate).to.gt(ether('1'));
        expect(response.wrappedToken).to.equal(tokens.WETH);
    });

    it('ywbtc -> wbtc', async function () {
        const { yvaultWrapper } = await loadFixture(initContracts);
        const response = await yvaultWrapper.wrap(YWBTCV2);
        expect(response.rate).to.gt(ether('1'));
        expect(response.wrappedToken).to.equal(tokens.WBTC);
    });
});
