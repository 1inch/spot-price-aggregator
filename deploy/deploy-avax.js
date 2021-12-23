const hre = require('hardhat');
const { getChainId } = hre;
const { BN } = require('@openzeppelin/test-helpers');
const { tokens } = require('../test/helpers.js');

const WAVAX = '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7';

const JOE_FACTORY = '0x9Ad6C38BE94206cA50bb0d90783181662f0Cfa10';
const JOE_HASH = '0x0bbca9af0511ad1a1da383135cf3a8d2ac620e549ef9f6ae3a4c33c2fed0af91';
const PANGOLIN_FACTORY = '0xefa94DE7a4656D787667C749f7E1223D71E9FD88';
const PANGOLIN_HASH = '0x40231f6b438bce0797c9ada29b718a87ea0a5cea3fe9a771abdd76bd41a3e545';

const connectors = [
    tokens.ETH, // avax
    WAVAX,
    tokens.NONE,
];

const delay = (ms) => 
    new Promise((resolve) => {
      setTimeout(resolve, ms);
    });

const tryRun = async (f, n = 10) => {
    if (typeof f !== 'function') {
        throw Error("f is not a function");
    }
    for (i = 0; ; i++) {
        try {
            return await f();
        } catch (error) {
            if (error.message === "Contract source code already verified" || error.message.includes('Reason: Already Verified')) {
                console.log("Contract already verified. Skipping verification");
                break;
            }
            console.error(error);
            await delay(1000);
            if (i > n) {
                throw new Error(`Couldn't verify deploy in ${n} runs`);
            }
        }
    }
}

module.exports = async ({ getNamedAccounts, deployments }) => {
    console.log('running deploy script');
    console.log('network id ', await getChainId());

    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    const wavaxWrapper = await deploy('BaseCoinWrapper', {
        args: [WAVAX],
        from: deployer,
    });

    await tryRun(() => hre.run('verify:verify', {
        address: wavaxWrapper.address,
        constructorArguments: [WAVAX],
    }));

    const multiWrapper = await deploy('MultiWrapper', {
        args: [[wavaxWrapper.address]],
        from: deployer,
    });

    await tryRun(() => hre.run('verify:verify', {
        address: multiWrapper.address,
        constructorArguments: [[wavaxWrapper.address]],
    }));

    const joeOracle = await deploy('UniswapV2LikeOracle_Joe', {
        args: [JOE_FACTORY, JOE_HASH],
        from: deployer,
        contract: 'UniswapV2LikeOracle'
    });

    await tryRun(() => hre.run('verify:verify', {
        address: joeOracle.address,
        constructorArguments: [JOE_FACTORY, JOE_HASH],
    }));

    const pangolinOracle = await deploy('UniswapV2LikeOracle_Pangolin', {
        args: [PANGOLIN_FACTORY, PANGOLIN_HASH],
        from: deployer,
        contract: 'UniswapV2LikeOracle'
    });

    await tryRun(() => hre.run('verify:verify', {
        address: pangolinOracle.address,
        constructorArguments: [PANGOLIN_FACTORY, PANGOLIN_HASH],
    }));

    const args = [
        multiWrapper.address,
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

    await tryRun(() => hre.run('verify:verify', {
        address: offchainOracle.address,
        constructorArguments: args,
    }));

    console.log('OffchainOracle deployed to:', offchainOracle.address);
};

module.exports.skip = async () => true;
