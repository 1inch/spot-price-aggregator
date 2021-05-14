const { tokens } = require('./helpers.js');

const OffchainOracle = artifacts.require('OffchainOracle');
const oracleDeployment = '0x080AB73787A8B13EC7F40bd7d00d6CC07F9b24d0';
const GasEstimator = artifacts.require('GasEstimator');

describe('ProdTest', async function () {
    this.timeout(1000000);

    before(async function () {
        this.offchainOracle = await OffchainOracle.at(oracleDeployment);
        this.gasEstimator = await GasEstimator.new();
    });

    it('dai -> eth', async function () {
        const gas = await this.gasEstimator.gascost(this.offchainOracle.address, this.offchainOracle.contract.methods.getRate(tokens.DAI, tokens.ETH).encodeABI());
        console.log(gas.toString());
    });
});
