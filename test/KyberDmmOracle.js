const { expectRevert } = require('@openzeppelin/test-helpers');
const { tokens } = require('./helpers.js');

const KyberDmmOracle = artifacts.require('KyberDmmOracle');

describe('KyberDmmOracle', async function () {
    before(async function () {
        this.kyberDmmOracle = await KyberDmmOracle.new('0x1c87257f5e8609940bc751a07bb085bb7f8cdbe6');
    });

    it('should revert with connector error', async function () {
        await expectRevert(
            this.kyberDmmOracle.contract.methods.getRate(tokens.KNC, tokens.EEE, tokens.WETH).call(),
            'KO: connector should be None',
        );
    });

    it('should revert with amount of pools error', async function () {
        await expectRevert(
            this.kyberDmmOracle.contract.methods.getRate(tokens.KNC, tokens.EEE, tokens.NONE).call(),
            'KO: there are no pools',
        );
    });

    it('should revert with _getBalances method error', async function () {
        await expectRevert(
            this.kyberDmmOracle.contract.methods.getPoolRate(tokens.KNC, tokens.EEE, '0x566EB77Bf46c2863501c4149bdcd60D313056E8f').call(),
            'KO: tokens do not match the pool',
        );
    });

    it('should return KNC rates of WETH', async function () {
        const result = await this.kyberDmmOracle.getRate(tokens.KNC, tokens.WETH, tokens.NONE);
        console.log(`1 KNC = ${web3.utils.fromWei(result.rate.toString(), 'ether')} WETH, weight = ${result.weight.toString()}`);
    });

    it('should return WETH rates of KNC', async function () {
        const result = await this.kyberDmmOracle.getRate(tokens.WETH, tokens.KNC, tokens.NONE);
        console.log(`1 WETH = ${web3.utils.fromWei(result.rate.toString(), 'ether')} KNC, weight = ${result.weight.toString()}`);
    });
});
