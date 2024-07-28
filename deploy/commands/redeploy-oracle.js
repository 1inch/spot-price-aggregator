const { getChainId } = require('hardhat');
const { deployAndGetContract } = require('@1inch/solidity-utils');
const { getContract } = require('../utils.js');

module.exports = async ({ getNamedAccounts, deployments }) => {
    const PARAMS = {
        contractName: 'YOUR_CONTRACT_NAME',
        constructorArgs: [],
        deploymentName: 'YOUR_DEPLOYMENT_NAME',
    };

    console.log('running deploy script: redeploy-oracle');
    console.log('network id ', await getChainId());

    const { deployer } = await getNamedAccounts();

    const offchainOracle = await getContract(deployments, 'OffchainOracle');
    const oldCustomOracle = await getContract(deployments, PARAMS.contractName, PARAMS.deploymentName);

    const oracles = await offchainOracle.oracles();
    const customOracleType = oracles.oracleTypes[oracles.allOracles.indexOf(await oldCustomOracle.getAddress())];

    const customOracle = await deployAndGetContract({
        ...PARAMS,
        deployments,
        deployer,
        skipIfAlreadyDeployed: false,
    });
    await offchainOracle.removeOracle(oldCustomOracle, customOracleType);
    await offchainOracle.addOracle(customOracle, customOracleType);
};

module.exports.skip = async () => true;
