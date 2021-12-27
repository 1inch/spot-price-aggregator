const hre = require('hardhat');
const { getChainId, ethers } = hre;

const SHIBA_FACTORY = '0x115934131916c8b277dd010ee02de363c09d037c';
const SHIBA_HASH = '0x65d1a3b1e46c6e4f1be1ad5f99ef14dc488ae0549dc97db9b30afe2241ce1c7a';

module.exports = async ({ getNamedAccounts, deployments }) => {
    console.log('running deploy script');
    console.log('network id ', await getChainId());

    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    const OffchainOracle = await ethers.getContractFactory('OffchainOracle');

    const shibaOracle = await deploy('UniswapV2LikeOracle', {
        args: [SHIBA_FACTORY, SHIBA_HASH],
        from: deployer,
        skipIfAlreadyDeployed: false,
    });

    const offchainOracle = OffchainOracle.attach((await deployments.get('OffchainOracle')).address);

    const txn = await offchainOracle.addOracle(shibaOracle.address, '0');
    await txn;

    console.log('ShibaSwap Oracle deployed to:', shibaOracle.address);

    if (await getChainId() !== '31337') {
        await hre.run('verify:verify', {
            address: shibaOracle.address,
            constructorArguments: [SHIBA_FACTORY, SHIBA_HASH],
        });
    }
};

module.exports.skip = async () => true;
