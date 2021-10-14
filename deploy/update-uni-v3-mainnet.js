const hre = require('hardhat');
const { getChainId, ethers } = hre;

const OLD_UNI_V3_ORACLE = '0xA7CfE47d7e4131219A44a39a7d02853Ec54eF787';

module.exports = async ({ getNamedAccounts, deployments }) => {
    console.log('running deploy script');
    console.log('network id ', await getChainId());

    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();
    const OffchainOracle = await ethers.getContractFactory('OffchainOracle');
    const offchainOracle = OffchainOracle.attach((await deployments.get('OffchainOracle')).address);

    const args = ['0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54'];

    const uniswapV3Oracle = await deploy('UniswapV3Oracle', {
        from: deployer,
        args: args,
        skipIfAlreadyDeployed: false,
        maxPriorityFeePerGas: 2e9,
        maxFeePerGas: 100e9,
    });

    const txn = await offchainOracle.addOracle(uniswapV3Oracle.address, '0', { from: deployer, maxPriorityFeePerGas: 2e9, maxFeePerGas: 100e9 });
    await txn;

    const txn2 = await offchainOracle.removeOracle(OLD_UNI_V3_ORACLE, '0', { from: deployer, maxPriorityFeePerGas: 2e9, maxFeePerGas: 100e9 });
    await txn2;

    if (await getChainId() !== '31337') {
        await hre.run('verify:verify', {
            address: uniswapV3Oracle.address,
            constructorArguments: args,
        });
    }
};

module.exports.skip = async () => true;
