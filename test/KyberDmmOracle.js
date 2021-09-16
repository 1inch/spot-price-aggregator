const { expectRevert } = require('@openzeppelin/test-helpers');
const { tokens } = require('./helpers.js');

const KyberDmmOracle = artifacts.require('KyberDmmOracle');

describe('KyberDmmOracle', async function () {
    const kncDecimals = 18;
    const usdcDecimals = 6;

    before(async function () {
        this.kyberDmmOracle = await KyberDmmOracle.new('0x833e4083b7ae46cea85695c4f7ed25cdad8886de');
    });

    it('should revert with amount of pools error', async function () {
        await expectRevert(
            this.kyberDmmOracle.contract.methods.getRate(tokens.KNC, tokens.EEE, tokens.NONE).call(),
            'KO: no pools',
        );
    });

    it('should revert with amount of pools with connector error', async function () {
        await expectRevert(
            this.kyberDmmOracle.contract.methods.getRate(tokens.KNC, tokens.WETH, tokens.MKR).call(),
            'KO: no pools with connector',
        );
    });

    it('KNC -> WETH', async function () {
        const result = await this.kyberDmmOracle.getRate(tokens.KNC, tokens.WETH, tokens.NONE);
        console.log(`1 KNC = ${web3.utils.fromWei(result.rate.toString(), 'ether')} WETH, weight = ${result.weight.toString()}`);
    });

    it('WETH -> KNC', async function () {
        const result = await this.kyberDmmOracle.getRate(tokens.WETH, tokens.KNC, tokens.NONE);
        console.log(`1 WETH = ${web3.utils.fromWei(result.rate.toString(), 'ether')} KNC, weight = ${result.weight.toString()}`);
    });

    it('KNC -> WETH -> USDC', async function () {
        const result = await this.kyberDmmOracle.getRate(tokens.KNC, tokens.USDC, tokens.WETH);
        const correction = web3.utils.toBN(10).pow(web3.utils.toBN(kncDecimals - usdcDecimals));
        console.log(`1 KNC = ${web3.utils.fromWei(result.rate.mul(correction).toString(), 'ether')} USDC, weight = ${result.weight.toString()}`);
    });

    it('USDC -> WETH -> KNC', async function () {
        const result = await this.kyberDmmOracle.getRate(tokens.USDC, tokens.KNC, tokens.WETH);
        const correction = web3.utils.toBN(10).pow(web3.utils.toBN(kncDecimals - usdcDecimals));
        console.log(`1 USDC = ${web3.utils.fromWei(result.rate.div(correction).toString(), 'ether')} KNC, weight = ${result.weight.toString()}`);
    });
});
