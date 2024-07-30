const { getChainId } = require('hardhat');
const { deployAndGetContract } = require('@1inch/solidity-utils');
const { getContract } = require('../utils.js');

module.exports = async ({ getNamedAccounts, deployments }) => {
    const PARAMS = {
        contractName: 'YOUR_CONTRACT_NAME',
        constructorArgs: [],
        deploymentName: 'YOUR_DEPLOYMENT_NAME',
        oracleType: '0',
    };

    console.log('running deploy script: deploy-oracle-and-add');
    console.log('network id ', await getChainId());

    const { deployer } = await getNamedAccounts();

    const offchainOracle = await getContract(deployments, 'OffchainOracle');
    const customOracle = await deployAndGetContract({
        ...PARAMS,
        deployments,
        deployer,
    });
    await offchainOracle.addOracle(customOracle, PARAMS.oracleType);
};

module.exports.skip = async () => true;
