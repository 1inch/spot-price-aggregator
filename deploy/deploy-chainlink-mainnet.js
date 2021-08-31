const hre = require('hardhat');
const { getChainId, ethers } = hre;

module.exports = async ({ getNamedAccounts, deployments }) => {
    console.log('running deploy script');
    console.log('network id ', await getChainId());

    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();
    const OffchainOracle = await ethers.getContractFactory('OffchainOracle');
    const offchainOracle = OffchainOracle.attach((await deployments.get('OffchainOracle')).address);

    const args = ['0x47Fb2585D2C56Fe188D0E6ec628a38b74fCeeeDf'];
    const chainlinkOracle = await deploy('ChainlinkOracle', {
        from: deployer,
        args: args,
        maxFeePerGas: 100000000000,
        maxPriorityFeePerGas: 2000000000,
        skipIfAlreadyDeployed: false,
    });

    const txn1 = await offchainOracle.addOracle(chainlinkOracle.address, '1');
    await txn1;

    await hre.run('verify:verify', {
        address: chainlinkOracle.address,
        constructorArguments: args,
    });
};

module.exports.skip = async () => true;
