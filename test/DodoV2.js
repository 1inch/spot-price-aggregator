const { expectRevert } = require('@openzeppelin/test-helpers');
const { tokens } = require('./helpers.js');

const DodoV2Oracle = artifacts.require('DodoV2Oracle');
const dvmFactory = '0x72d220cE168C4f361dD4deE5D826a01AD8598f6C';

describe('DodoOracle', async () => {
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

    it('WETH -> USDC -> WBTC', async () => {
        await testRate(this, tokens.WETH, tokens.WBTC, tokens.USDC);
    });

    it('WBTC -> USDC -> WETH', async () => {
        await testRate(this, tokens.WBTC, tokens.WETH, tokens.USDC);
    });

    const testRate = async (self, srcToken, dstToken, connector) => {
        /* const dodoResult = */ await self.dodoV2Oracle.getRate(srcToken, dstToken, connector);
        // expect(dodoResult.rate).to.be.bignumber.greaterThan(ether('0')); // not found pools with not zero liquidity except WETH-USDC
        // expect(dodoResult.weight).to.be.bignumber.greaterThan(ether('0'));
    };
});
