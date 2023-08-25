const { getChainId, ethers } = require('hardhat');
const { deployAndGetContract } = require('@1inch/solidity-utils');
const { getContract } = require('../utils.js');

module.exports = async ({ getNamedAccounts, deployments }) => {
    const PARAMS = {
        contractName: 'YOUR_CONTRACT_NAME',
        args: [],
        deploymentName: 'YOUR_DEPLOYMENT_NAME',
    };

    console.log('running deploy script: redeploy-wrapper');
    console.log('network id ', await getChainId());

    const { deployer } = await getNamedAccounts();

    const offchainOracle = await getContract(deployments, 'OffchainOracle');
    const multiWrapper = await getContract(deployments, 'MultiWrapper');
    if (ethers.utils.getAddress(await offchainOracle.multiWrapper()) !== ethers.utils.getAddress(multiWrapper.address)) {
        console.warn('MultiWrapper address in deployments is not equal to the address in OffchainOracle');
        return;
    }

    const oldCustomWrapper = await getContract(deployments, PARAMS.contractName, PARAMS.deploymentName);
    const customWrapper = await deployAndGetContract({
        contractName: PARAMS.contractName,
        constructorArgs: PARAMS.args,
        deployments,
        deployer,
        deploymentName: PARAMS.deploymentName,
        skipIfAlreadyDeployed: false,
    });
    await multiWrapper.removeWrapper(oldCustomWrapper.address);
    await multiWrapper.addWrapper(customWrapper.address);
};

module.exports.skip = async () => true;
