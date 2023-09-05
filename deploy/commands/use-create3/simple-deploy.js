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

    console.log('running deploy script: use-create3/simple-deploy');
    console.log('network id ', await getChainId());

    await deployContract(PARAMS, SALT_PROD, deployments);
};

const deployContract = async (params, saltProd, deployments) => {
    const create3Deployer = await ethers.getContractAt('ICreate3Deployer', contracts.create3Deployer);
    const CustomContract = await ethers.getContractFactory(params.contractName);
    const deployData = CustomContract.getDeployTransaction(
        ...params.args,
    ).data;

    const txn = await create3Deployer.deploy(saltProd, deployData);
    const receipt = await txn.wait();

    const customContractAddress = await create3Deployer.addressOf(saltProd);
    console.log(`${params.contractName} deployed to: ${customContractAddress}`);

    await hre.run('verify:verify', {
        address: customContractAddress,
        constructorArguments: params.args,
    });

    const CustomContractArtifact = await deployments.getArtifact(params.contractName);
    const CustomContractDeploymentData = {};
    CustomContractDeploymentData.address = customContractAddress;
    CustomContractDeploymentData.transactionHash = receipt.transactionHash;
    CustomContractDeploymentData.receipt = receipt;
    CustomContractDeploymentData.args = params.args;
    CustomContractDeploymentData.abi = CustomContractArtifact.abi;
    CustomContractDeploymentData.bytecode = CustomContractArtifact.bytecode;
    CustomContractDeploymentData.deployedBytecode = CustomContractArtifact.deployedBytecode;
    await deployments.save(params.deploymentName, CustomContractDeploymentData);
    return customContractAddress;
};

module.exports.deployContract = deployContract;
module.exports.skip = async () => true;
