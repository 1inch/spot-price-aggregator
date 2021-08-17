const hre = require('hardhat');
const { getChainId, ethers } = hre;

module.exports = async ({ getNamedAccounts, deployments }) => {
    console.log('running deploy script');
    console.log('network id ', await getChainId());

    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();
    const OffchainOracle = await ethers.getContractFactory('OffchainOracle');
    const offchainOracle = OffchainOracle.attach((await deployments.get('OffchainOracle')).address);

    const args = ['0x4E3b31eB0E5CB73641EE1E65E7dCEFe520bA3ef2'];
    const synthetixOracle = await deploy('SynthetixOracle', {
        from: deployer,
        args: args,
        skipIfAlreadyDeployed: false,
    });

    const txn1 = await offchainOracle.addOracle(synthetixOracle.address, '1');
    await txn1;

    await hre.run('verify:verify', {
        address: synthetixOracle.address,
        constructorArguments: args,
    });
};

module.exports.skip = async () => true;
