const hre = require('hardhat');
const { getChainId, ethers } = hre;

const WETH = '0x4200000000000000000000000000000000000006';

module.exports = async ({ getNamedAccounts, deployments }) => {
    console.log('running deploy script');
    console.log('network id ', await getChainId());

    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    const multiWrapper = await deploy('MultiWrapper', {
        args: [[]],
        from: deployer,
        skipIfAlreadyDeployed: true,
    });

    console.log('MultiWrapper deployed to:', multiWrapper.address);

    const uniswapV3Oracle = await deploy('UniswapV3Oracle', {
        from: deployer,
        skipIfAlreadyDeployed: false,
    });

    console.log('UniswapV3Oracle deployed to:', uniswapV3Oracle.address);

    const offchainOracle = await deploy('OffchainOracle', {
        args: [multiWrapper.address, [uniswapV3Oracle.address], ['0'], ['0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF', WETH], WETH],
        from: deployer,
        skipIfAlreadyDeployed: false,
    });

    console.log('OffchainOracle deployed to:', offchainOracle.address);
};

module.exports.skip = async () => true;
