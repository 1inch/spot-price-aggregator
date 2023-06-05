const { getChainId } = require('hardhat');
const {
    idempotentDeploy,
    getContract,
} = require('../utils.js');

module.exports = async ({ getNamedAccounts, deployments }) => {
    const PARAMS = {
        contractName: 'YOUR_CONTRACT_NAME',
        args: [],
        deploymentName: 'YOUR_DEPLOYMENT_NAME',
    };

    console.log('running syncswap deploy script');
    console.log('network id ', await getChainId());

    const { deployer } = await getNamedAccounts();

    const offchainOracle = await getContract('OffchainOracle', deployments);
    const oldCustomOracle = await getContract(PARAMS.contractName, deployments);

    const oracles = await offchainOracle.oracles();
    const customOracleType = oracles.oracleTypes[oracles.allOracles.indexOf(oldCustomOracle.address)];

    const customOracle = await idempotentDeploy(
        PARAMS.contractName,
        PARAMS.args,
        deployments,
        deployer,
        PARAMS.deploymentName,
        false,
        false,
    );
    await offchainOracle.removeOracle(oldCustomOracle.address, customOracleType);
    await offchainOracle.addOracle(customOracle.address, customOracleType);
};

module.exports.skip = async () => true;
