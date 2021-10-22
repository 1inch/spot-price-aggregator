const hre = require('hardhat');
const { getChainId, ethers } = hre;

const APE_FACTORY = '0x0841BD0B734E4F5853f0dD8d7Ea041c241fb0Da6';
const APE_HASH = '0xf4ccce374816856d11f00e4069e7cada164065686fbef53c6167a63ec2fd8c5b';

module.exports = async ({ getNamedAccounts, deployments }) => {
    console.log('running deploy script');
    console.log('network id ', await getChainId());

    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    const OffchainOracle = await ethers.getContractFactory('OffchainOracle');

    const apeOracle = await deploy('UniswapV2LikeOracle', {
        args: [APE_FACTORY, APE_HASH],
        from: deployer,
        skipIfAlreadyDeployed: false,
    });

    const offchainOracle = OffchainOracle.attach((await deployments.get('OffchainOracle')).address);

    const txn = await offchainOracle.addOracle(apeOracle.address, '0');
    await txn;

    console.log('ApeSwap Oracle deployed to:', apeOracle.address);

    if (await getChainId() !== '31337') {
        await hre.run('verify:verify', {
            address: apeOracle.address,
            constructorArguments: [APE_FACTORY, APE_HASH],
        });
    }
};

module.exports.skip = async () => true;
