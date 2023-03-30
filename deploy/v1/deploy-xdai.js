const { getChainId } = require('hardhat');
const { toBN } = require('@1inch/solidity-utils');
const { tokens } = require('../../test/helpers.js');
const {
    idempotentDeploy,
} = require('../utils.js');

const WXDAI = '0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d';

const ORACLES = {
    Honey: {
        factory: '0x1C232F01118CB8B424793ae03F870aa7D0ac7f77',
        initHash: '0x3f88503e8580ab941773b59034fb4b2a63e86dbc031b3633a925533ad3ed2b93',
    },
    Levin: {
        factory: '0x965769C9CeA8A7667246058504dcdcDb1E2975A5',
        initHash: '0x4955fd9146732ca7a64d43c7a8d65fe6db1acca27e9c5b3bee7c3abe5849f441',
    },
    Swapr: {
        factory: '0x5D48C95AdfFD4B40c1AAADc4e08fc44117E02179',
        initHash: '0xd306a548755b9295ee49cc729e13ca4a45e00199bbd890fa146da43a50571776',
    },
};

const connectors = [
    tokens.ETH,
    WXDAI,
    tokens.NONE,
];

module.exports = async ({ getNamedAccounts, deployments }) => {
    console.log('running xdai deploy script');
    console.log('network id ', await getChainId());

    const { deployer } = await getNamedAccounts();

    const skipVerify = true;

    const baseCoinWrapper = await idempotentDeploy(
        'BaseCoinWrapper',
        [WXDAI],
        deployments,
        deployer,
        'BaseCoinWrapper',
        skipVerify,
    );

    const multiWrapper = await idempotentDeploy(
        'MultiWrapper',
        [[baseCoinWrapper.address]],
        deployments,
        deployer,
        'MultiWrapper',
        skipVerify,
    );

    const honeyswapOracle = await idempotentDeploy(
        'UniswapV2LikeOracle',
        [ORACLES.Honey.factory, ORACLES.Honey.initHash],
        deployments,
        deployer,
        'UniswapV2LikeOracle_Honeyswap',
        skipVerify,
    );

    const levinswapOracle = await idempotentDeploy(
        'UniswapV2LikeOracle',
        [ORACLES.Levin.factory, ORACLES.Levin.initHash],
        deployments,
        deployer,
        'UniswapV2LikeOracle_Levinswap',
        skipVerify,
    );

    const swaprOracle = await idempotentDeploy(
        'UniswapV2LikeOracle',
        [ORACLES.Swapr.factory, ORACLES.Swapr.initHash],
        deployments,
        deployer,
        'UniswapV2LikeOracle_Swapr',
        skipVerify,
    );

    await idempotentDeploy(
        'OffchainOracle',
        [
            multiWrapper.address,
            [
                honeyswapOracle.address,
                levinswapOracle.address,
                swaprOracle.address,
            ],
            [
                (toBN('0')).toString(),
                (toBN('0')).toString(),
                (toBN('0')).toString(),
            ],
            connectors,
            WXDAI,
        ],
        deployments,
        deployer,
        'OffchainOracle',
        skipVerify,
    );
};

module.exports.skip = async () => true;
