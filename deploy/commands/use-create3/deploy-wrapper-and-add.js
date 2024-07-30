const hre = require('hardhat');
const { getChainId, ethers } = hre;
const { getContract } = require('../../utils.js');
const { deployAndGetContractWithCreate3 } = require('@1inch/solidity-utils');
const { contracts } = require('../../../test/helpers.js');

const SALT_INDEX = '';

module.exports = async ({ deployments }) => {
    const PARAMS = {
        contractName: 'YOUR_CONTRACT_NAME',
        constructorArgs: [],
        deploymentName: 'YOUR_DEPLOYMENT_NAME',
    };
    const SALT_PROD = ethers.keccak256(ethers.toUtf8Bytes(PARAMS.contractName + SALT_INDEX));

    console.log('running deploy script: use-create3/deploy-wrapper-and-add');
    console.log('network id ', await getChainId());

    const offchainOracle = await getContract(deployments, 'OffchainOracle');
    const multiWrapper = await getContract(deployments, 'MultiWrapper');
    if (ethers.getAddress(await offchainOracle.multiWrapper()) !== ethers.getAddress(await multiWrapper.getAddress())) {
        console.warn('MultiWrapper address in deployments is not equal to the address in OffchainOracle');
        return;
    }

    const customWrapper = await deployAndGetContractWithCreate3({
        ...PARAMS,
        create3Deployer: contracts.create3Deployer,
        salt: SALT_PROD,
        deployments,
    });

    await multiWrapper.addWrapper(customWrapper);
};

module.exports.skip = async () => true;
