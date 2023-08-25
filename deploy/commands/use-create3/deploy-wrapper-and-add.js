const hre = require('hardhat');
const { getChainId, ethers } = hre;
const { getContract } = require('../../utils.js');
const { deployContract } = require('./simple-deploy.js');

const SALT_INDEX = '';

module.exports = async ({ getNamedAccounts, deployments }) => {
    const PARAMS = {
        contractName: 'YOUR_CONTRACT_NAME',
        args: [],
        deploymentName: 'YOUR_DEPLOYMENT_NAME',
    };
    const SALT_PROD = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(PARAMS.contractName + SALT_INDEX));

    console.log('running deploy script: use-create3/deploy-wrapper-and-add');
    console.log('network id ', await getChainId());

    const offchainOracle = await getContract(deployments, 'OffchainOracle');
    const multiWrapper = await getContract(deployments, 'MultiWrapper');
    if (ethers.utils.getAddress(await offchainOracle.multiWrapper()) !== ethers.utils.getAddress(multiWrapper.address)) {
        console.warn('MultiWrapper address in deployments is not equal to the address in OffchainOracle');
        return;
    }

    const customWrapperAddress = await deployContract(PARAMS, SALT_PROD, deployments);

    await multiWrapper.addWrapper(customWrapperAddress);
};

module.exports.skip = async () => true;
