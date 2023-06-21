const { getChainId } = require('hardhat');
const { deployAndGetContract, toBN } = require('@1inch/solidity-utils');
const { tokens } = require('../../test/helpers.js');
const { addAaveTokens } = require('../utils.js');

const WAVAX = '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7';
const AAVE_LENDING_POOL = '0x4F01AeD16D97E3aB5ab2B501154DC9bb0F1A5A2C';

const WETH = '0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB';
const DAI = '0xd586E7F844cEa2F87f50152665BCbc2C279D8d70';
const USDT = '0xc7198437980c041c805A1EDcbA50c1Ce5db95118';
const USDC = '0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664';
const AAVE = '0x63a72806098Bd3D9520cC43356dD78afe5D386D9';
const WBTC = '0x50b7545627a5162F82A992c33b87aDc75187B218';

const ORACLES = {
    Joe: {
        factory: '0x9Ad6C38BE94206cA50bb0d90783181662f0Cfa10',
        initHash: '0x0bbca9af0511ad1a1da383135cf3a8d2ac620e549ef9f6ae3a4c33c2fed0af91',
    },
    Pangolin: {
        factory: '0xefa94DE7a4656D787667C749f7E1223D71E9FD88',
        initHash: '0x40231f6b438bce0797c9ada29b718a87ea0a5cea3fe9a771abdd76bd41a3e545',
    },
    Sushi: {
        factory: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4',
        initHash: '0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303',
    },
};

const AAWE_WRAPPER_TOKENS = [
    WETH,
    DAI,
    USDT,
    USDC,
    AAVE,
    WBTC,
    WAVAX,
];

const CONNECTORS = [
    tokens.ETH, // avax
    WAVAX,
    tokens.NONE,

    WETH,
    USDT,
    WBTC,
    USDC,
];

module.exports = async ({ getNamedAccounts, deployments }) => {
    console.log('running avax deploy script');
    console.log('network id ', await getChainId());

    const { deployer } = await getNamedAccounts();

    const wavaxWrapper = await deployAndGetContract({
        contractName: 'BaseCoinWrapper',
        constructorArgs: [WAVAX],
        deployments,
        deployer,
    });
    const multiWrapper = await deployAndGetContract({
        contractName: 'MultiWrapper',
        constructorArgs: [[wavaxWrapper.address]],
        deployments,
        deployer,
    });
    const aaveWrapperV2 = await deployAndGetContract({
        contractName: 'AaveWrapperV2',
        constructorArgs: [AAVE_LENDING_POOL],
        deployments,
        deployer,
    });
    await addAaveTokens(aaveWrapperV2, AAWE_WRAPPER_TOKENS);

    const existingWrappers = await multiWrapper.wrappers();
    if (!existingWrappers.includes(aaveWrapperV2.address)) {
        console.log('Adding aave wrapper');
        await (await multiWrapper.addWrapper(aaveWrapperV2.address)).wait();
    }

    const joeOracle = await deployAndGetContract({
        contractName: 'UniswapV2LikeOracle',
        constructorArgs: [ORACLES.Joe.factory, ORACLES.Joe.initHash],
        deployments,
        deployer,
        deploymentName: 'UniswapV2LikeOracle_Joe',
    });

    const pangolinOracle = await deployAndGetContract({
        contractName: 'UniswapV2LikeOracle',
        constructorArgs: [ORACLES.Pangolin.factory, ORACLES.Pangolin.initHash],
        deployments,
        deployer,
        deploymentName: 'UniswapV2LikeOracle_Pangolin',
    });

    const offchainOracle = await deployAndGetContract({
        contractName: 'OffchainOracle',
        constructorArgs: [
            multiWrapper.address,
            [
                joeOracle.address,
                pangolinOracle.address,
            ],
            [
                (toBN('0')).toString(),
                (toBN('0')).toString(),
            ],
            CONNECTORS,
            WAVAX,
        ],
        deployments,
        deployer,
    });

    // --- upd1

    const sushiOracle = await deployAndGetContract({
        contractName: 'UniswapV2LikeOracle',
        constructorArgs: [ORACLES.Sushi.factory, ORACLES.Sushi.initHash],
        deployments,
        deployer,
        deploymentName: 'UniswapV2LikeOracle_Sushi',
    });

    const existingOracles = await offchainOracle.oracles();
    if (!existingOracles.allOracles.includes(sushiOracle.address)) {
        console.log('Adding sushi oracle');
        await (await offchainOracle.addOracle(sushiOracle.address, '0')).wait();
    } else {
        console.log('Sushi oracle already added');
    }

    const existingConnectors = new Set((await offchainOracle.connectors()).map(x => x.toLowerCase()));
    const conntextorsToAdd = CONNECTORS.filter(x => !existingConnectors.has(x.toLowerCase()));
    console.log('Adding connextors: ', conntextorsToAdd);
    for (const connector of conntextorsToAdd) {
        await (await offchainOracle.addConnector(connector)).wait();
        console.log('Added', connector);
    }
    console.log('All oracles:', await offchainOracle.oracles());
    console.log('All connectors:', await offchainOracle.connectors());
};

module.exports.skip = async () => true;
