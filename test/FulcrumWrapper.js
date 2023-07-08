const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { expect, ether, deployContract } = require('@1inch/solidity-utils');
const { tokens } = require('./helpers.js');

const tests = [
    {
        token: tokens.DAI,
        itoken: tokens.iDAI,
    },
    {
        token: tokens.WETH,
        itoken: tokens.iETH,
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
