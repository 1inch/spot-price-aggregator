const hre = require('hardhat');
const { getChainId, ethers } = hre;
const { contracts } = require('../../../test/helpers.js');

const SALT_INDEX = '';

module.exports = async ({ getNamedAccounts, deployments }) => {
    const PARAMS = {
        contractName: 'YOUR_CONTRACT_NAME',
        args: [],
        deploymentName: 'YOUR_DEPLOYMENT_NAME',
    };
    const SALT_PROD = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(PARAMS.contractName + SALT_INDEX));

    console.log('running deploy script: use-create3/simple-deploy-oracle');
    console.log('network id ', await getChainId());

    await deployOracle(PARAMS, SALT_PROD, deployments);
};

const deployOracle = async (params, saltProd, deployments) => {
    const create3Deployer = await ethers.getContractAt('ICreate3Deployer', contracts.create3Deployer);
    const CustomOracle = await ethers.getContractFactory(params.contractName);
    const deployData = CustomOracle.getDeployTransaction(
        ...params.args,
    ).data;

    const txn = await create3Deployer.deploy(saltProd, deployData);
    const receipt = await txn.wait();

    const customOracleAddress = await create3Deployer.addressOf(saltProd);
    console.log(`${params.contractName} deployed to: ${customOracleAddress}`);

    await hre.run('verify:verify', {
        address: customOracleAddress,
        constructorArguments: params.args,
    });

    const CustomOracleArtifact = await deployments.getArtifact(params.contractName);
    const CustomOracleDeploymentData = {};
    CustomOracleDeploymentData.address = customOracleAddress;
    CustomOracleDeploymentData.transactionHash = receipt.transactionHash;
    CustomOracleDeploymentData.receipt = receipt;
    CustomOracleDeploymentData.args = params.args;
    CustomOracleDeploymentData.abi = CustomOracleArtifact.abi;
    CustomOracleDeploymentData.bytecode = CustomOracleArtifact.bytecode;
    CustomOracleDeploymentData.deployedBytecode = CustomOracleArtifact.deployedBytecode;
    await deployments.save(params.contractName, CustomOracleDeploymentData);
    return customOracleAddress;
};

module.exports.deployOracle = deployOracle;
module.exports.skip = async () => true;
