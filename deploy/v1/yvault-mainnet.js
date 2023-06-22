const { getChainId } = require('hardhat');
const { deployAndGetContract } = require('@1inch/solidity-utils');
const { getContract } = require('../utils.js');

module.exports = async ({ getNamedAccounts, deployments }) => {
    console.log('running yvault deploy script');
    console.log('network id ', await getChainId());

    const { deployer } = await getNamedAccounts();

    const multiWrapper = await getContract('MultiWrapper', deployments);

    const yvaultWrapper = await deployAndGetContract({
        contractName: 'YVaultWrapper',
        constructorArgs: [],
        deployments,
        deployer,
    });

    await (await multiWrapper.addWrapper(yvaultWrapper.address)).wait();
};

module.exports.skip = async () => true;
