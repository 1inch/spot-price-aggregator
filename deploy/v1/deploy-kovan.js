const { getChainId } = require('hardhat');
const {
    idempotentDeploy,
} = require('../utils.js');

const INCH_LP_FACTORY_ADDR = '0x2Be171963835b6d21202b62EEE54c67910680129';
const UNISWAP_V2_FACTORY = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f';
const UNISWAP_V2_HASH = '0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f';
const UNISWAP_V1_FACTORY = '0xECc6C0542710a0EF07966D7d1B10fA38bbb86523';
const WETH = '0xd0A1E359811322d97991E03f863a0C30C2cF029C';

module.exports = async ({ getNamedAccounts, deployments }) => {
    console.log('running kovan deploy script');
    console.log('network id ', await getChainId());

    const { deployer } = await getNamedAccounts();

    const mooniswapOracle = await idempotentDeploy(
        'MooniswapOracle',
        [INCH_LP_FACTORY_ADDR],
    );

    const uniswapV2Oracle = await idempotentDeploy(
        'UniswapV2LikeOracle',
        [UNISWAP_V2_FACTORY, UNISWAP_V2_HASH],
        deployments,
        deployer,
    );

    const uniswapV1Oracle = await idempotentDeploy(
        'UniswapOracle',
        [UNISWAP_V1_FACTORY],
        deployments,
        deployer,
    );

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

    await idempotentDeploy(
        'OffchainOracle',
        [multiWrapper.address, [mooniswapOracle.address, uniswapV2Oracle.address, uniswapV1Oracle.address], []],
        deployments,
        deployer,
    );
};

module.exports.skip = async () => true;
