const { getChainId } = require('hardhat');
const { deployAndGetContract } = require('@1inch/solidity-utils');

module.exports = async ({ getNamedAccounts, deployments }) => {
    const PARAMS = {
        contractName: 'YOUR_CONTRACT_NAME',
        constructorArgs: [],
        deploymentName: 'YOUR_DEPLOYMENT_NAME',
    };

    console.log('running deploy script: simple-deploy');
    console.log('network id ', await getChainId());

    const { deployer } = await getNamedAccounts();

    await deployAndGetContract({
        ...PARAMS,
        deployments,
        deployer,
    });
};

module.exports.skip = async () => true;
