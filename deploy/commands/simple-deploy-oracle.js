const { getChainId } = require('hardhat');
const { deployAndGetContract } = require('@1inch/solidity-utils');

module.exports = async ({ getNamedAccounts, deployments }) => {
    const PARAMS = {
        contractName: 'YOUR_CONTRACT_NAME',
        args: [],
        deploymentName: 'YOUR_DEPLOYMENT_NAME',
    };

    console.log('running deploy script: simple-deploy-oracle');
    console.log('network id ', await getChainId());

    const { deployer } = await getNamedAccounts();

    await deployAndGetContract({
        contractName: PARAMS.contractName,
        constructorArgs: PARAMS.args,
        deployments,
        deployer,
        deploymentName: PARAMS.deploymentName,
    });
};

module.exports.skip = async () => true;
