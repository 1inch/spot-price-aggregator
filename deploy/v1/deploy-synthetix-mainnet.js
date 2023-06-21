const { getChainId } = require('hardhat');
const { deployAndGetContract } = require('@1inch/solidity-utils');
const { getContract } = require('../utils.js');

module.exports = async ({ getNamedAccounts, deployments }) => {
    console.log('running synthetix-mainnet deploy script');
    console.log('network id ', await getChainId());

    const { deployer } = await getNamedAccounts();

    const synthetixOracle = await deployAndGetContract({
        contractName: 'SynthetixOracle',
        constructorArgs: ['0x4E3b31eB0E5CB73641EE1E65E7dCEFe520bA3ef2'],
        deployments,
        deployer,
    });

    const offchainOracle = await getContract('OffchainOracle', deployments);

    await (await offchainOracle.addOracle(synthetixOracle.address, '1')).wait();
};

module.exports.skip = async () => true;
