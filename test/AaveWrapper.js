const { ether } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const { tokens } = require('./helpers.js');

const AaveWrapper = artifacts.require('AaveWrapper');

const ADAI = '0x028171bCA77440897B824Ca71D1c56caC55b68A3';
const AWETH = '0x030bA81f1c18d280636F32af80b9AAd02Cf0854e';

contract('AaveWrapper', function () {
    before(async function () {
        this.aaveWrapper = await AaveWrapper.new();
        this.aaveWrapper.addMarkets([tokens.DAI, tokens.WETH]);
    });

    it('dai -> adai', async function () {
        const response = await this.aaveWrapper.wrap(tokens.DAI);
        expect(response.rate).to.be.bignumber.equal(ether('1'));
        expect(response.wrappedToken).to.be.equal(ADAI);
    });

    it('adai -> dai', async function () {
        const response = await this.aaveWrapper.wrap(ADAI);
        expect(response.rate).to.be.bignumber.equal(ether('1'));
        expect(response.wrappedToken).to.be.equal(tokens.DAI);
    });

    it('weth -> aweth', async function () {
        const response = await this.aaveWrapper.wrap(tokens.WETH);
        expect(response.rate).to.be.bignumber.equal(ether('1'));
        expect(response.wrappedToken).to.be.equal(AWETH);
    });

    it('aweth -> weth', async function () {
        const response = await this.aaveWrapper.wrap(AWETH);
        expect(response.rate).to.be.bignumber.equal(ether('1'));
        expect(response.wrappedToken).to.be.equal(tokens.WETH);
    });
});
