const { getChainId } = require('hardhat');
const {
    idempotentDeploy,
} = require('../utils.js');

const QUICKSWAP_V2_FACTORY = '0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32';
const QUICKSWAP_V2_HASH = '0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f';
const WMATIC = '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270';

module.exports = async ({ getNamedAccounts, deployments }) => {
    console.log('running matic deploy script');
    console.log('network id ', await getChainId());

    const { deployer } = await getNamedAccounts();

    const skipVerify = true;

    const uniswapV2Oracle = await idempotentDeploy(
        'UniswapV2LikeOracle',
        [QUICKSWAP_V2_FACTORY, QUICKSWAP_V2_HASH],
        deployments,
        deployer,
        'UniswapV2LikeOracle',
        skipVerify,
    );

    const wethWrapper = await idempotentDeploy(
        'BaseCoinWrapper',
        [WMATIC],
        deployments,
        deployer,
        'BaseCoinWrapper',
        skipVerify,
    );

    const multiWrapper = await idempotentDeploy(
        'MultiWrapper',
        [[wethWrapper.address]],
        deployments,
        deployer,
        'MultiWrapper',
        skipVerify,
    );

    await idempotentDeploy(
        'OffchainOracle',
        [multiWrapper.address, [uniswapV2Oracle.address], []],
        deployments,
        deployer,
        'OffchainOracle',
        skipVerify,
    );
};

module.exports.skip = async () => true;
