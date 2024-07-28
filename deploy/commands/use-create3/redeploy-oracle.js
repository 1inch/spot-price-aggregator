const hre = require('hardhat');
const { getChainId, ethers } = hre;
const { getContract } = require('../../utils.js');
const { deployAndGetContractWithCreate3 } = require('@1inch/solidity-utils');
const { contracts } = require('../../../test/helpers.js');

const SALT_INDEX = '';

module.exports = async ({ getNamedAccounts, deployments }) => {
    const PARAMS = {
        contractName: 'YOUR_CONTRACT_NAME',
        constructorArgs: [],
        deploymentName: 'YOUR_DEPLOYMENT_NAME',
    };
    const SALT_PROD = ethers.keccak256(ethers.toUtf8Bytes(PARAMS.contractName + SALT_INDEX));

    console.log('running deploy script: use-create3/redeploy-oracle');
    console.log('network id ', await getChainId());

    const { deployer: txSigner } = await getNamedAccounts();

    const offchainOracle = await getContract(deployments, 'OffchainOracle');
    const oldCustomOracle = await getContract(deployments, PARAMS.contractName, PARAMS.deploymentName);
    const oracles = await offchainOracle.oracles();
    const customOracleType = oracles.oracleTypes[oracles.allOracles.indexOf(await oldCustomOracle.getAddress())];

    const customOracle = await deployAndGetContractWithCreate3({
        ...PARAMS,
        create3Deployer: contracts.create3Deployer,
        SALT_PROD,
        deployments,
        txSigner,
    });

    await offchainOracle.removeOracle(oldCustomOracle, customOracleType);
    await offchainOracle.addOracle(customOracle, customOracleType);
};

module.exports.skip = async () => true;
