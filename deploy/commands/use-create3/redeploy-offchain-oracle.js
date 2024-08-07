const hre = require('hardhat');
const { getChainId, ethers } = hre;
const { getContract } = require('../../utils.js');
const { deployAndGetContractWithCreate3 } = require('@1inch/solidity-utils');
const { contracts } = require('../../../test/helpers.js');

const SALT_INDEX = '';

module.exports = async ({ getNamedAccounts, deployments }) => {
    const SALT_PROD = ethers.keccak256(ethers.toUtf8Bytes('OffchainOracle' + SALT_INDEX));

    console.log('running deploy script: use-create3/redeploy-offchain-oracle');
    console.log('network id ', await getChainId());

    const { deployer } = await getNamedAccounts();
    const OffchainOracleDeploymentData = await deployments.get('OffchainOracle');
    const oldOffchainOracle = await getContract(deployments, 'OffchainOracle');
    const wBase = OffchainOracleDeploymentData.args[4];
    const oracles = await oldOffchainOracle.oracles();

    const PARAMS = {
        contractName: 'OffchainOracle',
        constructorArgs: [
            await oldOffchainOracle.multiWrapper(),
            [...oracles.allOracles],
            [...oracles.oracleTypes],
            [...await oldOffchainOracle.connectors()],
            wBase,
            deployer,
        ],
        deploymentName: 'OffchainOracle',
    };

    await deployAndGetContractWithCreate3({
        ...PARAMS,
        create3Deployer: contracts.create3Deployer,
        salt: SALT_PROD,
        deployments,
    });
};

module.exports.skip = async () => true;
