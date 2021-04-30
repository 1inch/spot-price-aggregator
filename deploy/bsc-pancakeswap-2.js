const hre = require('hardhat');
const { getChainId, ethers } = hre;

const PANCAKE_V2_FACTORY = '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73';
const PANCAKE_V2_HASH = '0x00fb7f630766e6a796048ea87d01acd3068e8ff67d078148a3fa3f4a84f69bd5';

module.exports = async ({ getNamedAccounts, deployments }) => {
    console.log('running deploy script');
    console.log('network id ', await getChainId());

    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    const OffchainOracle = await ethers.getContractFactory('OffchainOracle');

    const pancakeV2Oracle = await deploy('UniswapV2LikeOracle', {
        args: [PANCAKE_V2_FACTORY, PANCAKE_V2_HASH],
        from: deployer,
        skipIfAlreadyDeployed: false,
    });

    const offchainOracle = OffchainOracle.attach((await deployments.get('OffchainOracle')).address);

    await offchainOracle.addOracle(pancakeV2Oracle.address);

    console.log('Pancake V2 Oracle deployed to:', pancakeV2Oracle.address);

    await hre.run('verify:verify', {
        address: pancakeV2Oracle.address,
        constructorArguments: [PANCAKE_V2_FACTORY, PANCAKE_V2_HASH],
    });
};

module.exports.skip = async () => true;
