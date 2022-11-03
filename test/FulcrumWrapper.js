const { ethers } = require('hardhat');
const { expect, ether } = require('@1inch/solidity-utils');
const { tokens } = require('./helpers.js');

const IDAI = '0x6b093998D36f2C7F0cc359441FBB24CC629D5FF0';
const IWETH = '0xB983E01458529665007fF7E0CDdeCDB74B967Eb6';

const tests = [
    {
        token: tokens.DAI,
        itoken: IDAI,
    },
    {
        token: tokens.WETH,
        itoken: IWETH,
    },
];

describe('FulcrumWrapper', async function () {
    before(async function () {
        const FulcrumWrapper = await ethers.getContractFactory('FulcrumWrapper');
        this.fulcrumWrapper = await FulcrumWrapper.deploy();
        await this.fulcrumWrapper.deployed();
        await this.fulcrumWrapper.addMarkets([tokens.DAI, tokens.WETH]);
    });

    it('wrap', async function () {
        for (const test of tests) {
            const response = await this.fulcrumWrapper.wrap(test.token);
            expect(response.rate).to.be.gt(ether('1'));
            expect(response.wrappedToken).to.equal(test.itoken);
        }
    });

    it('unwrap', async function () {
        for (const test of tests) {
            const response = await this.fulcrumWrapper.wrap(test.itoken);
            expect(response.rate).to.be.lt(ether('1'));
            expect(response.wrappedToken).to.equal(test.token);
        }
    });
});
