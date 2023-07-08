const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { expect, ether, deployContract } = require('@1inch/solidity-utils');
const { tokens } = require('./helpers.js');

const IUSDC = '0xF013406A0B1d544238083DF0B93ad0d2cBE0f65f';

const tests = [
    {
        token: tokens.USDC,
        itoken: IUSDC,
    },
];

describe('FulcrumWrapperLegacy', function () {
    async function initContracts () {
        const fulcrumWrapperLegacy = await deployContract('FulcrumWrapperLegacy');
        await fulcrumWrapperLegacy.addMarkets([IUSDC]);
        return { fulcrumWrapperLegacy };
    }

    it('wrap', async function () {
        const { fulcrumWrapperLegacy } = await loadFixture(initContracts);
        for (const test of tests) {
            const response = await fulcrumWrapperLegacy.wrap(test.token);
            expect(response.rate).to.gt(ether('1'));
            expect(response.wrappedToken).to.equal(test.itoken);
        }
    });

    it('unwrap', async function () {
        const { fulcrumWrapperLegacy } = await loadFixture(initContracts);
        for (const test of tests) {
            const response = await fulcrumWrapperLegacy.wrap(test.itoken);
            expect(response.rate).to.lt(ether('1'));
            expect(response.wrappedToken).to.equal(test.token);
        }
    });
});
