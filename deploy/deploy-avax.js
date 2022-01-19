const hre = require('hardhat');
const { getChainId } = hre;
const { BN } = require('@openzeppelin/test-helpers');
const { tokens } = require('../test/helpers.js');
const constants = require('@openzeppelin/test-helpers/src/constants');

const WAVAX = '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7';
const AAVE_LENDING_POOL = '0x4F01AeD16D97E3aB5ab2B501154DC9bb0F1A5A2C';

const JOE_FACTORY = '0x9Ad6C38BE94206cA50bb0d90783181662f0Cfa10';
const JOE_HASH = '0x0bbca9af0511ad1a1da383135cf3a8d2ac620e549ef9f6ae3a4c33c2fed0af91';
const PANGOLIN_FACTORY = '0xefa94DE7a4656D787667C749f7E1223D71E9FD88';
const PANGOLIN_HASH = '0x40231f6b438bce0797c9ada29b718a87ea0a5cea3fe9a771abdd76bd41a3e545';

const WETH = "0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB";
const DAI = "0xd586E7F844cEa2F87f50152665BCbc2C279D8d70";
const USDT = "0xc7198437980c041c805A1EDcbA50c1Ce5db95118";
const USDC = "0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664";
const AAVE = "0x63a72806098Bd3D9520cC43356dD78afe5D386D9";
const WBTC = "0x50b7545627a5162F82A992c33b87aDc75187B218";
const AAWE_WRAPPER_TOKENS = [
    WETH,
    DAI,
    USDT,
    USDC,
    AAVE,
    WBTC,
    WAVAX
];

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
        throw Error('f is not a function');
    }
    for (let i = 0; ; i++) {
        try {
            return await f();
        } catch (error) {
            if (error.message === 'Contract source code already verified' || error.message.includes('Reason: Already Verified')) {
                console.log('Contract already verified. Skipping verification');
                break;
            }
            console.error(error);
            await delay(1000);
            if (i > n) {
                throw new Error(`Couldn't verify deploy in ${n} runs`);
            }
        }
    }
};

const zip = (a, b) => a.map((k, i) => [k, b[i]]);

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

    const aaveWrapperV2 = await deploy('AaveWrapperV2', {
        args: [AAVE_LENDING_POOL],
        from: deployer,
    });

    await tryRun(() => hre.run('verify:verify', {
        address: aaveWrapperV2.address,
        constructorArguments: [AAVE_LENDING_POOL],
    }));

    const aTokens = await Promise.all(AAWE_WRAPPER_TOKENS.map(x => aaveWrapperV2.tokenToaToken(x)));
    const tokensToDeploy = zip(AAWE_WRAPPER_TOKENS, aTokens).filter(([, aToken]) => aToken !== constants.ZERO_ADDRESS).map(([token]) => token);
    console.log("AaveWrapperV2 tokens to deploy: ", tokensToDeploy);
    await aaveWrapperV2.addMarkets(tokensToDeploy);

    const joeOracle = await deploy('UniswapV2LikeOracle_Joe', {
        args: [JOE_FACTORY, JOE_HASH],
        from: deployer,
        contract: 'UniswapV2LikeOracle',
    });

    await tryRun(() => hre.run('verify:verify', {
        address: joeOracle.address,
        constructorArguments: [JOE_FACTORY, JOE_HASH],
    }));

    const pangolinOracle = await deploy('UniswapV2LikeOracle_Pangolin', {
        args: [PANGOLIN_FACTORY, PANGOLIN_HASH],
        from: deployer,
        contract: 'UniswapV2LikeOracle',
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

module.exports.skip = async () => false;
