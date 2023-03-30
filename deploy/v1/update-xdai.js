const { getChainId } = require('hardhat');

const {
    idempotentDeploy,
    getContract,
} = require('../utils.js');

const WETH = '0x6A023CCd1ff6F2045C3309768eAd9E68F978f6e1';
const HONEY = '0x71850b7E9Ee3f13Ab46d67167341E4bDc905Eef9';
const USDC = '0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83';
const USDT = '0x4ECaBa5870353805a9F068101A40E0f32ed605C6';

const ORACLES = {
    Honey: {
        factory: '0xA818b4F111Ccac7AA31D0BCc0806d64F2E0737D7',
        initHash: '0x3f88503e8580ab941773b59034fb4b2a63e86dbc031b3633a925533ad3ed2b93',
    },

    Sushi: {
        factory: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4',
        initHash: '0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303',
    },
};

const NEW_CONNECTORS = [
    WETH,
    HONEY,
    USDC,
    USDT,
];

module.exports = async ({ getNamedAccounts, deployments }) => {
    console.log('running xdai deploy script');
    console.log('network id ', await getChainId());

    const { deployer } = await getNamedAccounts();

    const offchainOracle = await getContract('OffchainOracle', deployments);

    for (const connector of NEW_CONNECTORS) {
        await (await offchainOracle.addConnector(connector)).wait();
    }

    await (await offchainOracle.removeOracle((await deployments.get('UniswapV2LikeOracle_Honeyswap')).address, '0')).wait();

    const honeyswapOracle = await idempotentDeploy(
        'UniswapV2LikeOracle',
        [ORACLES.Honey.factory, ORACLES.Honey.initHash],
        deployments,
        deployer,
        'UniswapV2LikeOracle_Honeyswap',
        false, // skipVerify
    );

    const sushiswapOracle = await idempotentDeploy(
        'UniswapV2LikeOracle',
        [ORACLES.Sushi.factory, ORACLES.Sushi.initHash],
        deployments,
        deployer,
        'UniswapV2LikeOracle_Sushiswap',
        false, // skipVerify
    );

    await (await offchainOracle.addOracle(honeyswapOracle.address, '0')).wait();
    await (await offchainOracle.addOracle(sushiswapOracle.address, '0')).wait();
};

module.exports.skip = async () => true;
