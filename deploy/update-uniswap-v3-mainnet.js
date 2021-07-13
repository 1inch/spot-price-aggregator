const hre = require('hardhat');
const { getChainId, ethers } = hre;

module.exports = async ({ getNamedAccounts, deployments }) => {
    console.log('running deploy script');
    console.log('network id ', await getChainId());

    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();
    const OffchainOracle = await ethers.getContractFactory('OffchainOracle');
    const offchainOracle = OffchainOracle.attach((await deployments.get('OffchainOracle')).address);

    const args = ['0x1F98431c8aD98523631AE4a59f267346ea31F984', ['500', '3000', '10000']];

    const uniswapV3Oracle = await deploy('UniswapV3Oracle', {
        from: deployer,
        args: args,
        skipIfAlreadyDeployed: false,
    });

    const oldUniswapV3OracleAddress = '0x98260849dF966C691206FF2dB3438bf202023C19';

    const txn1 = await offchainOracle.removeOracle(oldUniswapV3OracleAddress, '0');
    const txn2 = await offchainOracle.addOracle(uniswapV3Oracle.address, '0');
    await Promise.all([txn1, txn2]);

    await hre.run('verify:verify', {
        address: uniswapV3Oracle.address,
        constructorArguments: args,
    });
};

module.exports.skip = async () => true;
