const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { expect, ether } = require('@1inch/solidity-utils');
const { tokens, deployContract } = require('./helpers.js');

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

describe('FulcrumWrapper', function () {
    async function initContracts () {
        const fulcrumWrapper = await deployContract('FulcrumWrapper');
        await fulcrumWrapper.addMarkets([tokens.DAI, tokens.WETH]);
        return { fulcrumWrapper };
    }

    it('wrap', async function () {
        const { fulcrumWrapper } = await loadFixture(initContracts);
        for (const test of tests) {
            const response = await fulcrumWrapper.wrap(test.token);
            expect(response.rate).to.gt(ether('1'));
            expect(response.wrappedToken).to.equal(test.itoken);
        }
    });

    it('unwrap', async function () {
        const { fulcrumWrapper } = await loadFixture(initContracts);
        for (const test of tests) {
            const response = await fulcrumWrapper.wrap(test.itoken);
            expect(response.rate).to.lt(ether('1'));
            expect(response.wrappedToken).to.equal(test.token);
        }
    });
});
