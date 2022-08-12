const { getChainId } = require('hardhat');
const { toBN } = require('@1inch/solidity-utils');
const { tokens } = require('../test/helpers.js');
const {
    idempotentDeploy,
} = require('./utils.js');

const WETH = '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1';

const ORACLES = {
    Swapr: {
        factory: '0x359F20Ad0F42D75a5077e65F30274cABe6f4F01a',
        initHash: '0xd306a548755b9295ee49cc729e13ca4a45e00199bbd890fa146da43a50571776',
    },
    Sushi: {
        factory: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4',
        initHash: '0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303',
    },
    UniV3: {
        initHash: '0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54',
    },
};

const connectors = [
    tokens.ETH,
    WETH,
    tokens.NONE,
];

module.exports = async ({ getNamedAccounts, deployments }) => {
    console.log('running arbitrum deploy script');
    console.log('network id ', await getChainId());

    const { deployer } = await getNamedAccounts();

    const wethWrapper = await idempotentDeploy(
        'BaseCoinWrapper',
        [WETH],
        deployments,
        deployer,
    );

    const multiWrapper = await idempotentDeploy(
        'MultiWrapper',
        [[wethWrapper.address]],
        deployments,
        deployer,
    );

    const uniswapV3Oracle = await idempotentDeploy(
        'UniswapV3Oracle',
        [ORACLES.UniV3.initHash],
        deployments,
        deployer,
    );

    const swaprOracle = await idempotentDeploy(
        'UniswapV2LikeOracle',
        [ORACLES.Swapr.factory, ORACLES.Swapr.initHash],
        deployments,
        deployer,
        'UniswapV2LikeOracle',
    );

    const sushiOracle = await idempotentDeploy(
        'UniswapV2LikeOracle',
        [ORACLES.Sushi.factory, ORACLES.Sushi.initHash],
        deployments,
        deployer,
        'UniswapV2LikeOracle',
    );

    await idempotentDeploy(
        'OffchainOracle',
        [
            multiWrapper,
            [
                sushiOracle.address,
                swaprOracle.address,
                uniswapV3Oracle.address,
            ],
            [
                (toBN('0')).toString(),
                (toBN('0')).toString(),
                (toBN('0')).toString(),
            ],
            connectors,
            WETH,
        ],
        deployments,
        deployer,
    );
};

module.exports.skip = async () => true;
