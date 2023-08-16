const { getChainId } = require('hardhat');
const { deployAndGetContract } = require('@1inch/solidity-utils');
const { getContract } = require('../utils.js');

module.exports = async ({ getNamedAccounts, deployments }) => {
    console.log('running deploy script: redeploy-offchain-oracle');
    console.log('network id ', await getChainId());

    const { deployer } = await getNamedAccounts();

    const oldOffchainOracle = await getContract(deployments, 'OffchainOracle');

    const wBase = (await deployments.get('OffchainOracle')).args[4];
    const oracles = await oldOffchainOracle.oracles();

    await deployAndGetContract({
        contractName: 'OffchainOracle',
        constructorArgs: [
            await oldOffchainOracle.multiWrapper(),
            oracles.allOracles,
            oracles.oracleTypes,
            await oldOffchainOracle.connectors(),
            wBase,
            deployer,
        ],
        deployments,
        deployer,
        skipIfAlreadyDeployed: false,
    });
};

module.exports.skip = async () => true;
