const { getChainId } = require('hardhat');

const INCH_LP_FACTORY_ADDR = '0x0d15038f8a0362b4cE71D6c879d56bF9Fc2884cf';

module.exports = async ({ getNamedAccounts, deployments }) => {
    console.log('running deploy script');
    console.log('network id ', await getChainId());

    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    const mooniswapOracle = await deploy('MooniswapOracle-ovm', {
        args: [INCH_LP_FACTORY_ADDR],
        from: deployer,
        skipIfAlreadyDeployed: true,
    });

    const multiWrapper = await deploy('MultiWrapper-ovm', {
        args: [[]],
        from: deployer,
        skipIfAlreadyDeployed: true,
    });

    const offchainOracle = await deploy('OffchainOracle-ovm', {
        args: [multiWrapper.address, [mooniswapOracle.address], []],
        from: deployer,
        skipIfAlreadyDeployed: true,
    });

    console.log('OffchainOracle deployed to:', offchainOracle.address);
};

module.exports.skip = async () => true;
