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
        oracleType: '0',
    };
    const SALT_PROD = ethers.keccak256(ethers.toUtf8Bytes(PARAMS.contractName + SALT_INDEX));

    console.log('running deploy script: use-create3/deploy-oracle-and-add');
    console.log('network id ', await getChainId());

    const { deployer: txSigner } = await getNamedAccounts();

    const customOracle = await deployAndGetContractWithCreate3({
        ...PARAMS,
        create3Deployer: contracts.create3Deployer,
        SALT_PROD,
        deployments,
        txSigner,
    });

    const offchainOracle = await getContract(deployments, 'OffchainOracle');
    await offchainOracle.addOracle(customOracle, PARAMS.oracleType);
};

module.exports.skip = async () => true;
