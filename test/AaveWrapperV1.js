const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { expect, ether } = require('@1inch/solidity-utils');
const { tokens, deployContract } = require('./helpers.js');

const ADAIV1 = '0xfC1E690f61EFd961294b3e1Ce3313fBD8aa4f85d';
const AETHV1 = '0x3a3A65aAb0dd2A17E3F1947bA16138cd37d08c04';

describe('AaveWrapperV1', function () {
    async function initContracts () {
        const aaveWrapper = await deployContract('AaveWrapperV1');
        await aaveWrapper.addMarkets([tokens.DAI, tokens.EEE]);
        return { aaveWrapper };
    }

    it('dai -> adai', async function () {
        const { aaveWrapper } = await loadFixture(initContracts);
        const response = await aaveWrapper.wrap(tokens.DAI);
        expect(response.rate).to.equal(ether('1'));
        expect(response.wrappedToken).to.equal(ADAIV1);
    });

    it('adai -> dai', async function () {
        const { aaveWrapper } = await loadFixture(initContracts);
        const response = await aaveWrapper.wrap(ADAIV1);
        expect(response.rate).to.equal(ether('1'));
        expect(response.wrappedToken).to.equal(tokens.DAI);
    });

    it('eth -> aeth', async function () {
        const { aaveWrapper } = await loadFixture(initContracts);
        const response = await aaveWrapper.wrap(tokens.ETH);
        expect(response.rate).to.equal(ether('1'));
        expect(response.wrappedToken).to.equal(AETHV1);
    });

    it('aeth -> eth', async function () {
        const { aaveWrapper } = await loadFixture(initContracts);
        const response = await aaveWrapper.wrap(AETHV1);
        expect(response.rate).to.equal(ether('1'));
        expect(response.wrappedToken).to.equal(tokens.ETH);
    });
});
