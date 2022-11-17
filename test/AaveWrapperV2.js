const { ethers } = require('hardhat');
const { expect, ether } = require('@1inch/solidity-utils');
const { tokens } = require('./helpers.js');

const ADAIV2 = '0x028171bCA77440897B824Ca71D1c56caC55b68A3';
const AWETHV2 = '0x030bA81f1c18d280636F32af80b9AAd02Cf0854e';

describe('AaveWrapperV2', function () {
    before(async function () {
        const AaveWrapperV2 = await ethers.getContractFactory('AaveWrapperV2');
        this.aaveWrapper = await AaveWrapperV2.deploy('0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9');
        await this.aaveWrapper.deployed();
        await this.aaveWrapper.addMarkets([tokens.DAI, tokens.WETH]);
    });

    it('dai -> adai', async function () {
        const response = await this.aaveWrapper.wrap(tokens.DAI);
        expect(response.rate).to.equal(ether('1'));
        expect(response.wrappedToken).to.equal(ADAIV2);
    });

    it('adai -> dai', async function () {
        const response = await this.aaveWrapper.wrap(ADAIV2);
        expect(response.rate).to.equal(ether('1'));
        expect(response.wrappedToken).to.equal(tokens.DAI);
    });

    it('weth -> aweth', async function () {
        const response = await this.aaveWrapper.wrap(tokens.WETH);
        expect(response.rate).to.equal(ether('1'));
        expect(response.wrappedToken).to.equal(AWETHV2);
    });

    it('aweth -> weth', async function () {
        const response = await this.aaveWrapper.wrap(AWETHV2);
        expect(response.rate).to.equal(ether('1'));
        expect(response.wrappedToken).to.equal(tokens.WETH);
    });
});
