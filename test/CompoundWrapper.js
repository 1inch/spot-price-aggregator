const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { expect, ether } = require('@1inch/solidity-utils');
const { tokens, deployContract } = require('./helpers.js');

const CDAI = '0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643';
const CETH = '0x4Ddc2D193948926D02f9B1fE9e1daa0718270ED5';

describe('CompoundWrapper', function () {
    async function initContracts () {
        const compoundWrapper = await deployContract('CompoundLikeWrapper', ['0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B', CETH]);
        await compoundWrapper.addMarkets([CDAI]);
        return { compoundWrapper };
    }

    it('dai -> cdai', async function () {
        const { compoundWrapper } = await loadFixture(initContracts);
        const response = await compoundWrapper.wrap(tokens.DAI);
        expect(response.rate).to.lt('5000000000');
        expect(response.wrappedToken).to.equal(CDAI);
    });

    it('cdai -> dai', async function () {
        const { compoundWrapper } = await loadFixture(initContracts);
        const response = await compoundWrapper.wrap(CDAI);
        expect(response.rate).to.gt(ether('200000000'));
        expect(response.wrappedToken).to.equal(tokens.DAI);
    });

    it('eth -> ceth', async function () {
        const { compoundWrapper } = await loadFixture(initContracts);
        const response = await compoundWrapper.wrap(tokens.ETH);
        expect(response.rate).to.lt('5000000000');
        expect(response.wrappedToken).to.equal(CETH);
    });

    it('ceth -> eth', async function () {
        const { compoundWrapper } = await loadFixture(initContracts);
        const response = await compoundWrapper.wrap(CETH);
        expect(response.rate).to.gt(ether('200000000'));
        expect(response.wrappedToken).to.equal(tokens.ETH);
    });
});
