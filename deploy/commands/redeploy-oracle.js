const { getChainId } = require('hardhat');
const { deployAndGetContract } = require('@1inch/solidity-utils');
const { getContract } = require('../utils.js');

module.exports = async ({ getNamedAccounts, deployments }) => {
    const PARAMS = {
        contractName: 'YOUR_CONTRACT_NAME',
        args: [],
        deploymentName: 'YOUR_DEPLOYMENT_NAME',
    };

    console.log('running deploy script: redeploy-oracle');
    console.log('network id ', await getChainId());

    const { deployer } = await getNamedAccounts();

    const offchainOracle = await getContract(deployments, 'OffchainOracle');
    const oldCustomOracle = await getContract(deployments, PARAMS.contractName, PARAMS.deploymentName);

    const oracles = await offchainOracle.oracles();
    const customOracleType = oracles.oracleTypes[oracles.allOracles.indexOf(oldCustomOracle.address)];

    const customOracle = await deployAndGetContract({
        contractName: PARAMS.contractName,
        constructorArgs: PARAMS.args,
        deployments,
        deployer,
        deploymentName: PARAMS.deploymentName,
        skipIfAlreadyDeployed: false,
    });
    await offchainOracle.removeOracle(oldCustomOracle.address, customOracleType);
    await offchainOracle.addOracle(customOracle.address, customOracleType);
};

module.exports.skip = async () => true;
