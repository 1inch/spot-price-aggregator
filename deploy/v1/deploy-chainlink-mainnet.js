const { getChainId } = require('hardhat');
const { deployAndGetContract } = require('@1inch/solidity-utils');
const { getContract } = require('../utils.js');

module.exports = async ({ getNamedAccounts, deployments }) => {
    console.log('running chainlink-mainnet deploy script');
    console.log('network id ', await getChainId());

    const { deployer } = await getNamedAccounts();

    const offchainOracle = await getContract('OffchainOracle', deployments);

    const chainlinkOracle = await deployAndGetContract({
        contractName: 'ChainlinkOracle',
        constructorArgs: ['0x47Fb2585D2C56Fe188D0E6ec628a38b74fCeeeDf'],
        deployments,
        deployer,
    });

    await (await offchainOracle.addOracle(chainlinkOracle.address, '1')).wait();
};

module.exports.skip = async () => true;
