const hre = require('hardhat');
const { getChainId, ethers } = hre;
const { contracts } = require('../../../test/helpers.js');
const { deployAndGetContractWithCreate3 } = require('@1inch/solidity-utils');

const SALT_INDEX = '';

module.exports = async ({ getNamedAccounts, deployments }) => {
    const PARAMS = {
        contractName: 'YOUR_CONTRACT_NAME',
        constructorArgs: [],
        deploymentName: 'YOUR_DEPLOYMENT_NAME',
    };
    const SALT_PROD = ethers.keccak256(ethers.toUtf8Bytes(PARAMS.contractName + SALT_INDEX));

    console.log('running deploy script: use-create3/simple-deploy');
    console.log('network id ', await getChainId());

    const { deployer: txSigner } = await getNamedAccounts();

    await deployAndGetContractWithCreate3({
        ...PARAMS,
        create3Deployer: contracts.create3Deployer,
        SALT_PROD,
        deployments,
        txSigner,
    });
};

module.exports.skip = async () => true;
