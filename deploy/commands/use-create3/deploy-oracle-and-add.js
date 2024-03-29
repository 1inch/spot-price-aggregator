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
        oracleType: '0',
    };
    const SALT_PROD = ethers.keccak256(ethers.toUtf8Bytes(PARAMS.contractName + SALT_INDEX));

    console.log('running deploy script: use-create3/deploy-oracle-and-add');
    console.log('network id ', await getChainId());

    const customOracleAddress = await deployContract(PARAMS, SALT_PROD, deployments);

    const offchainOracle = await getContract(deployments, 'OffchainOracle');
    await offchainOracle.addOracle(customOracleAddress, PARAMS.oracleType);
};

module.exports.skip = async () => true;
