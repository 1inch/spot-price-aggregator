const { getChainId } = require('hardhat');
const { deployAndGetContract } = require('@1inch/solidity-utils');
const { getContract } = require('../utils.js');

module.exports = async ({ getNamedAccounts, deployments }) => {
    console.log('running synthetix-optimistic deploy script');
    console.log('network id ', await getChainId());

    const { deployer } = await getNamedAccounts();

    const synthetixOracle = await deployAndGetContract({
        contractName: 'SynthetixOracle',
        constructorArgs: ['0x1Cb059b7e74fD21665968C908806143E744D5F30'],
        deployments,
        deployer,
        deploymentName: 'SynthetixOracle',
        skipVerify: false,
    });

    const offchainOracle = await getContract('OffchainOracle', deployments);

    await (await offchainOracle.addOracle(synthetixOracle.address, '1')).wait();
};

module.exports.skip = async () => true;
