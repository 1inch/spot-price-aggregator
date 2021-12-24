const hre = require('hardhat');
const { getChainId, ethers } = hre;

module.exports = async ({ getNamedAccounts, deployments }) => {
    console.log('running deploy script');
    console.log('network id ', await getChainId());

    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    const OffchainOracle = await ethers.getContractFactory('OffchainOracle');
    const UniswapV3Oracle = await ethers.getContractFactory('UniswapV3Oracle');

    const offchainOracle = OffchainOracle.attach((await deployments.get('OffchainOracle')).address);
    const oldUniswapV3Oracle = UniswapV3Oracle.attach((await deployments.get('UniswapV3Oracle')).address);

    const uniswapV3Oracle = await deploy('UniswapV3Oracle', {
        from: deployer,
        skipIfAlreadyDeployed: false,
    });

    const txn1 = await offchainOracle.removeOracle(oldUniswapV3Oracle.address, '0');
    await txn1;
    const txn2 = await offchainOracle.addOracle(uniswapV3Oracle.address, '0');
    await txn2;

    if (await getChainId() !== '31337') {
        await hre.run('verify:verify', {
            address: uniswapV3Oracle.address,
        });
    };
};

module.exports.skip = async () => true;
