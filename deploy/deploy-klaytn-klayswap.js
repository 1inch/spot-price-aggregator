const hre = require('hardhat');
const { getChainId, ethers } = hre;
const { BN } = require('@openzeppelin/test-helpers');

const KLAY_SWAP_FACTORY = '0xc6a2ad8cc6e4a7e08fc37cc5954be07d499e7654';
const KLAY_SWAP_STORAGE = '0x1289550d988177575154c2CA45c95CCfb32F837d';

module.exports = async ({ getNamedAccounts, deployments }) => {
    console.log('running klaytn deploy script');
    const chainId = await getChainId();
    console.log('network id ', chainId);
    if (chainId !== '8217') {
        console.log('skipping wrong chain id deployment');
        return;
    }

    const { deploy, getOrNull } = deployments;
    const { deployer } = await getNamedAccounts();

    const idempotentDeploy = async (contractName, constructorArgs, deploymentName = contractName) => {
        const existingContract = await getOrNull(deploymentName);
        if (existingContract) {
            console.log(`Skipping deploy for existing contract ${contractName} (${deploymentName})`);
            return existingContract;
        }

        const contract = await deploy(deploymentName, {
            args: constructorArgs,
            from: deployer,
            contract: contractName,
        });

        return contract;
    };

    const idempotentDeployGetContract = async (contractName, constructorArgs, deploymentName = contractName) => {
        const deployResult = await idempotentDeploy(contractName, constructorArgs, deploymentName);
        const contractFactory = await ethers.getContractFactory(contractName);
        const contract = contractFactory.attach(deployResult.address);
        return contract;
    };

    const klaySwap = await idempotentDeploy('KlaySwapOracle', [KLAY_SWAP_FACTORY, KLAY_SWAP_STORAGE]);
    const offchainOracle = await idempotentDeployGetContract('OffchainOracle');
    await offchainOracle.addOracle(klaySwap.address, (new BN('0')).toString());
};

module.exports.skip = async () => true;
