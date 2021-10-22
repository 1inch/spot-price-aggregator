const hre = require('hardhat');
const { getChainId, ethers } = hre;

module.exports = async ({ getNamedAccounts, deployments }) => {
    console.log('running deploy script');
    console.log('network id ', await getChainId());

    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();
    const OffchainOracle = await ethers.getContractFactory('OffchainOracle');
    const offchainOracle = OffchainOracle.attach((await deployments.get('OffchainOracle')).address);

    const args = ['0x878dFE971d44e9122048308301F540910Bbd934c'];
    const kyberDmmOracle = await deploy('KyberDmmOracle', {
        from: deployer,
        args: args,
        skipIfAlreadyDeployed: false,
    });

    const txn1 = await offchainOracle.addOracle(kyberDmmOracle.address, '0');
    await txn1;

    if (await getChainId() !== '31337') {
        await hre.run('verify:verify', {
            address: kyberDmmOracle.address,
            constructorArguments: args,
        });
    }
};

module.exports.skip = async () => true;
