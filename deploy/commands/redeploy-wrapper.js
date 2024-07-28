const { getChainId, ethers } = require('hardhat');
const { deployAndGetContract } = require('@1inch/solidity-utils');
const { getContract } = require('../utils.js');

module.exports = async ({ getNamedAccounts, deployments }) => {
    const PARAMS = {
        contractName: 'YOUR_CONTRACT_NAME',
        constructorArgs: [],
        deploymentName: 'YOUR_DEPLOYMENT_NAME',
    };

    console.log('running deploy script: redeploy-wrapper');
    console.log('network id ', await getChainId());

    const { deployer } = await getNamedAccounts();

    const offchainOracle = await getContract(deployments, 'OffchainOracle');
    const multiWrapper = await getContract(deployments, 'MultiWrapper');
    if (ethers.getAddress(await offchainOracle.multiWrapper()) !== ethers.getAddress(await multiWrapper.getAddress())) {
        console.warn('MultiWrapper address in deployments is not equal to the address in OffchainOracle');
        return;
    }

    const oldCustomWrapper = await getContract(deployments, PARAMS.contractName, PARAMS.deploymentName);
    const customWrapper = await deployAndGetContract({
        ...PARAMS,
        deployments,
        deployer,
        skipIfAlreadyDeployed: false,
    });
    await multiWrapper.removeWrapper(oldCustomWrapper);
    await multiWrapper.addWrapper(customWrapper);
};

module.exports.skip = async () => true;
