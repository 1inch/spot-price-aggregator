const hre = require('hardhat');
const { getChainId, ethers } = hre;

module.exports = async ({ getNamedAccounts, deployments }) => {
    console.log('running deploy script');
    console.log('network id ', await getChainId());

    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    const OffchainOracle = await ethers.getContractFactory('OffchainOracle');
    const offchainOracle = OffchainOracle.attach((await deployments.get('OffchainOracle')).address);

    const multiWrapper = await offchainOracle.multiWrapper();
    const oracles = await offchainOracle.oracles();
    const connectors = await offchainOracle.connectors();
    const wBase = (await deployments.get('OffchainOracle')).args[4];

    console.log('multiWrapper', multiWrapper);
    console.log('oracles', oracles.allOracles);
    console.log('oracle types', oracles.oracleTypes);
    console.log('connectors', connectors);
    console.log('wBase', wBase);

    const args = [
        multiWrapper,
        oracles.allOracles,
        oracles.oracleTypes,
        connectors,
        wBase,
    ];

    const newOffchainOracle = await deploy('OffchainOracle', {
        args,
        from: deployer,
        skipIfAlreadyDeployed: true,
    });

    console.log('OffchainOracle deployed to:', newOffchainOracle.address);

    await hre.run('verify:verify', {
        address: offchainOracle.address,
        constructorArguments: args,
    });
};

module.exports.skip = async () => true;
