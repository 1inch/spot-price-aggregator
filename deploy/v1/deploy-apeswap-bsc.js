const { getChainId } = require('hardhat');
const { deployAndGetContract } = require('@1inch/solidity-utils');
const { getContract } = require('../utils.js');

const ORACLES = {
    Apeswap: {
        factory: '0x0841BD0B734E4F5853f0dD8d7Ea041c241fb0Da6',
        initHash: '0xf4ccce374816856d11f00e4069e7cada164065686fbef53c6167a63ec2fd8c5b',
    },
};

module.exports = async ({ getNamedAccounts, deployments }) => {
    console.log('running apeswap bsc deploy script');
    console.log('network id ', await getChainId());

    const { deployer } = await getNamedAccounts();

    const apeOracle = await deployAndGetContract({
        contractName: 'UniswapV2LikeOracle',
        constructorArgs: [ORACLES.Apeswap.factory, ORACLES.Apeswap.initHash],
        deployments,
        deployer,
    });

    const offchainOracle = await getContract('OffchainOracle', deployments);

    await (await offchainOracle.addOracle(apeOracle.address, '0')).wait();
};

module.exports.skip = async () => true;
