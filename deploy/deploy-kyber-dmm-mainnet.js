const hre = require('hardhat');
const { getChainId, ethers } = hre;

module.exports = async ({ getNamedAccounts, deployments }) => {
    console.log('running deploy script');
    console.log('network id ', await getChainId());

    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();
    const OffchainOracle = await ethers.getContractFactory('OffchainOracle');
    const offchainOracle = OffchainOracle.attach((await deployments.get('OffchainOracle')).address);

    const args = ['0x833e4083b7ae46cea85695c4f7ed25cdad8886de'];
    const kyberDmmOracle = await deploy('KyberDmmOracle', {
        from: deployer,
        args: args,
        skipIfAlreadyDeployed: false,
        maxPriorityFeePerGas: 2e9,
        maxFeePerGas: 100e9,
        nonce: 652,
    });

    const txn1 = await offchainOracle.addOracle(
        kyberDmmOracle.address,
        '0',
        { from: deployer, maxPriorityFeePerGas: 2e9, maxFeePerGas: 100e9, nonce: 653 }
    );
    await txn1;

    if (await getChainId() !== '31337') {
        await hre.run('verify:verify', {
            address: kyberDmmOracle.address,
            constructorArguments: args,
        });
    }
};

module.exports.skip = async () => true;
