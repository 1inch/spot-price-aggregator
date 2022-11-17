const { ethers } = require('hardhat');
const { expect, ether } = require('@1inch/solidity-utils');
const { tokens } = require('./helpers.js');

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
];

describe('FulcrumWrapperLegacy', function () {
    before(async function () {
        const FulcrumWrapperLegacy = await ethers.getContractFactory('FulcrumWrapperLegacy');
        this.fulcrumWrapperLegacy = await FulcrumWrapperLegacy.deploy();
        await this.fulcrumWrapperLegacy.deployed();
        await this.fulcrumWrapperLegacy.addMarkets([IUSDC, IWETH]);
    });

    it('wrap', async function () {
        for (const test of tests) {
            const response = await this.fulcrumWrapperLegacy.wrap(test.token);
            expect(response.rate).to.gt(ether('1'));
            expect(response.wrappedToken).to.equal(test.itoken);
        }
    });

    it('unwrap', async function () {
        for (const test of tests) {
            const response = await this.fulcrumWrapperLegacy.wrap(test.itoken);
            expect(response.rate).to.lt(ether('1'));
            expect(response.wrappedToken).to.equal(test.token);
        }
    });
});
