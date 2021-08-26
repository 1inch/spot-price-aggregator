const hre = require('hardhat');
const { getChainId, ethers } = hre;
const DFYN_V2_FACTORY = '0xE7Fb3e833eFE5F9c441105EB65Ef8b261266423B';
const DFYN_V2_HASH = '0xf187ed688403aa4f7acfada758d8d53698753b998a3071b06f1b777f4330eaf3';

module.exports = async ({ getNamedAccounts, deployments }) => {
    console.log('running deploy script');
    console.log('network id ', await getChainId());

    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    const OffchainOracle = await ethers.getContractFactory('OffchainOracle');

    const dfynV2Oracle = await deploy('UniswapV2LikeOracle', {
        args: ,
        from: deployer,
        skipIfAlreadyDeployed: true,
    });

    const offchainOracle = OffchainOracle.attach((await deployments.get('OffchainOracle')).address);

    await offchainOracle.addOracle(dfynV2Oracle.address, '0');

    console.log('Dfyn Oracle deployed to:', dfynV2Oracle.address);

    await hre.run('verify:verify', {
        address: dfynV2Oracle.address,
        constructorArguments: [DFYN_V2_FACTORY, DFYN_V2_HASH],
    });
};

module.exports.skip = async () => true;
