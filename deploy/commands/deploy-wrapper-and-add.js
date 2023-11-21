const { getChainId, ethers } = require('hardhat');
const { deployAndGetContract } = require('@1inch/solidity-utils');
const { getContract } = require('../utils.js');

module.exports = async ({ getNamedAccounts, deployments }) => {
    const PARAMS = {
        contractName: 'YOUR_CONTRACT_NAME',
        args: [],
        deploymentName: 'YOUR_DEPLOYMENT_NAME',
    };

    console.log('running deploy script: deploy-wrapper-and-add');
    console.log('network id ', await getChainId());

    const { deployer } = await getNamedAccounts();

    const offchainOracle = await getContract(deployments, 'OffchainOracle');
    const multiWrapper = await getContract(deployments, 'MultiWrapper');
    if (ethers.getAddress(await offchainOracle.multiWrapper()) !== ethers.getAddress(await multiWrapper.getAddress())) {
        console.warn('MultiWrapper address in deployments is not equal to the address in OffchainOracle');
        return;
    }

    const customWrapper = await deployAndGetContract({
        contractName: PARAMS.contractName,
        constructorArgs: PARAMS.args,
        deployments,
        deployer,
        deploymentName: PARAMS.deploymentName,
    });
    await multiWrapper.addWrapper(customWrapper);
};

module.exports.skip = async () => true;
