const { getChainId } = require('hardhat');
const { deployAndGetContract } = require('@1inch/solidity-utils');
const { getContract } = require('../utils.js');

const ORACLES = {
    Dfyn: {
        factory: '0xE7Fb3e833eFE5F9c441105EB65Ef8b261266423B',
        initHash: '0xf187ed688403aa4f7acfada758d8d53698753b998a3071b06f1b777f4330eaf3',
    },
};

module.exports = async ({ getNamedAccounts, deployments }) => {
    console.log('running dfyn-matic deploy script');
    console.log('network id ', await getChainId());

    const { deployer } = await getNamedAccounts();

    const offchainOracle = await getContract('OffchainOracle', deployments);

    const dfynV2Oracle = await deployAndGetContract({
        contractName: 'UniswapV2LikeOracle',
        constructorArgs: [ORACLES.Dfyn.factory, ORACLES.Dfyn.initHash],
        deployments,
        deployer,
    });

    await (await offchainOracle.addOracle(dfynV2Oracle.address, '0')).wait();
};

module.exports.skip = async () => true;
