const { getChainId } = require('hardhat');
const { deployAndGetContract } = require('@1inch/solidity-utils');

const WETH = '0x4200000000000000000000000000000000000006';
const NONE = '0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF';

module.exports = async ({ getNamedAccounts, deployments }) => {
    console.log('running ovm deploy script');
    console.log('network id ', await getChainId());

    const { deployer } = await getNamedAccounts();

    const skipVerify = true;

    const multiWrapper = await deployAndGetContract({
        contractName: 'MultiWrapper',
        constructorArgs: [[]],
        deployments,
        deployer,
        deploymentName: 'MultiWrapper',
        skipVerify,
    });

    const uniswapV3Oracle = await deployAndGetContract({
        contractName: 'UniswapV3Oracle',
        constructorArgs: [],
        deployments,
        deployer,
        deploymentName: 'UniswapV3Oracle',
        skipVerify,
    });

    await deployAndGetContract({
        contractName: 'OffchainOracle',
        constructorArgs: [multiWrapper.address, [uniswapV3Oracle.address], ['0'], [NONE, WETH], WETH],
        deployments,
        deployer,
        deploymentName: 'OffchainOracle',
        skipVerify,
    });
};

module.exports.skip = async () => true;
