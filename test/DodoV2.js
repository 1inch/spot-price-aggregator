const { expectRevert, ether } = require('@openzeppelin/test-helpers');
const { tokens } = require('./helpers.js');
const { expect } = require('chai');

const DodoV2Oracle = artifacts.require('DodoV2Oracle');
const dvmFactory = '0x72d220cE168C4f361dD4deE5D826a01AD8598f6C';

describe('DodoV2Oracle', async () => {
    before(async () => {
        this.dodoV2Oracle = await DodoV2Oracle.new(dvmFactory);
    });

    it('should revert with amount of pools error', async () => {
        await expectRevert(
            this.dodoV2Oracle.getRate(tokens.USDT, tokens['1INCH'], tokens.NONE),
            'DOV2: machines not found',
        );
    });

    it('WETH -> USDC', async () => {
        await testRate(this, tokens.WETH, tokens.USDC, tokens.NONE);
    });

    it('USDC -> WETH', async () => {
        await testRate(this, tokens.USDC, tokens.WETH, tokens.NONE);
    });

    it('XRA -> WETH -> USDC', async () => {
        await testRate(this, tokens.XRA, tokens.USDC, tokens.WETH);
    });

    it('USDC -> WETH -> XRA', async () => {
        await testRate(this, tokens.USDC, tokens.XRA, tokens.WETH);
    });

    const testRate = async (self, srcToken, dstToken, connector) => {
        const dodoResult = await self.dodoV2Oracle.getRate(srcToken, dstToken, connector);
        expect(dodoResult.rate).to.be.bignumber.greaterThan(ether('0'));
        expect(dodoResult.weight).to.be.bignumber.greaterThan(ether('0'));
    };
});
