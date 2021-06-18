const hre = require('hardhat');
const { getChainId, ethers } = hre;

module.exports = async ({ getNamedAccounts, deployments }) => {
    console.log('running deploy script');
    console.log('network id ', await getChainId());

    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();
    const MultiWrapper = await ethers.getContractFactory('MultiWrapper');
    const multiWrapper = MultiWrapper.attach((await deployments.get('MultiWrapper')).address);

    const yvaultWrapper = await deploy('YVaultWrapper', {
        from: deployer,
        skipIfAlreadyDeployed: true,
    });

    const txn = await multiWrapper.addWrapper(yvaultWrapper.address);
    await txn;

    await hre.run('verify:verify', {
        address: yvaultWrapper.address,
    });
};

module.exports.skip = async () => true;
