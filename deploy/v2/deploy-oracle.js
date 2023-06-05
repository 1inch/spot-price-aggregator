const { getChainId } = require('hardhat');
const {
    idempotentDeploy,
    getContract,
} = require('../utils.js');
const { tokens } = require('../../test/helpers.js');

module.exports = async ({ getNamedAccounts, deployments }) => {
    const PARAMS = {
        contractName: 'YOUR_CONTRACT_NAME',
        args: [],
        deploymentName: 'YOUR_DEPLOYMENT_NAME',
        oracleType: '0',
    };

    console.log('running syncswap deploy script');
    console.log('network id ', await getChainId());

    const { deployer } = await getNamedAccounts();

    const offchainOracle = await getContract('OffchainOracle', deployments);
    const customOracle = await idempotentDeploy(
        PARAMS.contractName,
        PARAMS.args,
        deployments,
        deployer,
        PARAMS.deploymentName,
        false,
        true,
    );
    await offchainOracle.addOracle(customOracle.address, PARAMS.oracleType);
};

module.exports.skip = async () => true;
