const { ether } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const { tokens } = require('./helpers.js');

const FulcrumWrapperLegacy = artifacts.require('FulcrumWrapperLegacy');

const IUSDC = '0xF013406A0B1d544238083DF0B93ad0d2cBE0f65f';
const IWETH = '0x77f973FCaF871459aa58cd81881Ce453759281bC';

const tests = [
    {
        token: tokens.USDC,
        itoken: IUSDC,
    },
    {
        token: tokens.WETH,
        itoken: IWETH,
    },
]

describe('FulcrumWrapperLegacy', async function () {
    before(async function () {
        this.fulcrumWrapperLegacy = await FulcrumWrapperLegacy.new();
        await this.fulcrumWrapperLegacy.addMarkets([IUSDC, IWETH]);
    });

    it('wrap', async function () {
        for (const test of tests) {
            const response = await this.fulcrumWrapperLegacy.wrap(test.token);
            expect(response.rate).to.be.bignumber.greaterThan(ether('1'));
            expect(response.wrappedToken).to.be.equal(test.itoken);
        }
    });

    it('unwrap', async function () {
        for (const test of tests) {
            const response = await this.fulcrumWrapperLegacy.wrap(test.itoken);
            expect(response.rate).to.be.bignumber.lessThan(ether('1'));
            expect(response.wrappedToken).to.be.equal(test.token);
        }
    });
});
