const hre = require('hardhat');
const { getChainId } = hre;
const { BN } = require('@openzeppelin/test-helpers');
const { tokens } = require('../test/helpers.js');

const WAVAX = '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7';

const JOE_FACTORY = '0x9Ad6C38BE94206cA50bb0d90783181662f0Cfa10';
const JOE_HASH = '0x0bbca9af0511ad1a1da383135cf3a8d2ac620e549ef9f6ae3a4c33c2fed0af91';
const PANGOLIN_FACTORY = '0xefa94DE7a4656D787667C749f7E1223D71E9FD88';
const PANGOLIN_HASH = '40231f6b438bce0797c9ada29b718a87ea0a5cea3fe9a771abdd76bd41a3e545';

const connectors = [
    tokens.ETH, // avax
    WAVAX,
    tokens.NONE,
];

module.exports = async ({ getNamedAccounts, deployments }) => {
    console.log('running deploy script');
    console.log('network id ', await getChainId());

    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    const wavaxWrapper = await deploy('BaseCoinWrapper', {
        args: [WAVAX],
        from: deployer,
    });

    await hre.run('verify:verify', {
        address: wavaxWrapper.address,
        constructorArguments: [WAVAX],
    });

    const multiWrapper = await deploy('MultiWrapper', {
        args: [[wavaxWrapper.address]],
        from: deployer,
    });

    await hre.run('verify:verify', {
        address: multiWrapper.address,
        constructorArguments: [[wavaxWrapper.address]],
    });

    const joeOracle = await deploy('UniswapV2LikeOracle', {
        args: [JOE_FACTORY, JOE_HASH],
        from: deployer,
    });

    await hre.run('verify:verify', {
        address: joeOracle.address,
        constructorArguments: [JOE_FACTORY, JOE_HASH],
    });

    const pangolinOracle = await deploy('UniswapV2LikeOracle', {
        args: [PANGOLIN_FACTORY, PANGOLIN_HASH],
        from: deployer,
    });

    await hre.run('verify:verify', {
        address: pangolinOracle.address,
        constructorArguments: [PANGOLIN_FACTORY, PANGOLIN_HASH],
    });

    const args = [
        multiWrapper,
        [
            joeOracle.address,
            pangolinOracle.address,
        ],
        [
            (new BN('0')).toString(),
            (new BN('0')).toString(),
        ],
        connectors,
        WAVAX,
    ];

    const offchainOracle = await deploy('OffchainOracle', {
        args: args,
        from: deployer,
        skipIfAlreadyDeployed: true,
    });

    await hre.run('verify:verify', {
        address: offchainOracle.address,
        constructorArguments: args,
    });

    console.log('OffchainOracle deployed to:', offchainOracle.address);
};

module.exports.skip = async () => true;
