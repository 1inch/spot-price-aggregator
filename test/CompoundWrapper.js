const { ether } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const { tokens } = require('./helpers.js');

const CompoundWrapper = artifacts.require('CompoundWrapper');
const CDAI = '0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643';
const CETH = '0x4Ddc2D193948926D02f9B1fE9e1daa0718270ED5';

contract('CompoundWrapper', function () {
    before(async function () {
        this.compoundWrapper = await CompoundWrapper.new();
        await this.compoundWrapper.addMarkets([CDAI]);
    });

    it('dai -> cdai', async function () {
        const response = await this.compoundWrapper.wrap(tokens.DAI);
        expect(response.rate).to.be.bignumber.lessThan('5000000000');
        expect(response.wrappedToken).to.be.equal(CDAI);
    });

    it('cdai -> dai', async function () {
        const response = await this.compoundWrapper.wrap(CDAI);
        expect(response.rate).to.be.bignumber.greaterThan(ether('200000000'));
        expect(response.wrappedToken).to.be.equal(tokens.DAI);
    });

    it('eth -> ceth', async function () {
        const response = await this.compoundWrapper.wrap(tokens.ETH);
        expect(response.rate).to.be.bignumber.lessThan('5000000000');
        expect(response.wrappedToken).to.be.equal(CETH);
    });

    it('ceth -> eth', async function () {
        const response = await this.compoundWrapper.wrap(CETH);
        expect(response.rate).to.be.bignumber.greaterThan(ether('200000000'));
        expect(response.wrappedToken).to.be.equal(tokens.ETH);
    });
});
