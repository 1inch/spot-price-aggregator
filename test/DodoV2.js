const { tokens } = require('./helpers.js');
const { ethers } = require('hardhat');
const { expect, ether } = require('@1inch/solidity-utils');

const dvmFactory = '0x72d220cE168C4f361dD4deE5D826a01AD8598f6C';

describe('DodoV2Oracle', async () => {
    before(async () => {
        const DodoV2Oracle = await ethers.getContractFactory('DodoV2Oracle');
        this.dodoV2Oracle = await DodoV2Oracle.deploy(dvmFactory);
        await this.dodoV2Oracle.deployed();
    });

    it('should revert with amount of pools error', async () => {
        await expect(
            this.dodoV2Oracle.getRate(tokens.USDT, tokens['1INCH'], tokens.NONE),
        ).to.be.revertedWith('DOV2: machines not found');
    });

    it('WETH -> USDC', async () => {
        await testRate(tokens.WETH, tokens.USDC, tokens.NONE);
    });

    it('USDC -> WETH', async () => {
        await testRate(tokens.USDC, tokens.WETH, tokens.NONE);
    });

    it('XRA -> WETH -> USDC', async () => {
        await testRate(tokens.XRA, tokens.USDC, tokens.WETH);
    });

    it.skip('USDC -> WETH -> XRA', async () => {
        await testRate(tokens.USDC, tokens.XRA, tokens.WETH);
    });

    const testRate = async (srcToken, dstToken, connector) => {
        const dodoResult = await this.dodoV2Oracle.getRate(srcToken, dstToken, connector);
        expect(dodoResult.rate).to.gt(ether('0'));
        expect(dodoResult.weight).to.gt(ether('0'));
    };
});
