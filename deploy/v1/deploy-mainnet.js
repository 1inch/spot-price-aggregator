const { getChainId } = require('hardhat');
const { toBN } = require('@1inch/solidity-utils');
const { tokens } = require('../../test/helpers.js');
const {
    idempotentDeploy,
} = require('../utils.js');

const oracles = {
    uniswapV2Oracle: '0x8dc76c16e90351C1574a3Eea5c5797C475eA7292',
    sushiswapOracle: '0x4749B35AE40897B40585633261c5f743730fE8BC',
    equalizerOracle: '0x37E440D480F8891B62cF61f2E36fB9503D1e3B57',
    oneInchLP1Oracle: '0x30829F90270eb4270d8CAdFAfcF13f1DF841be1d',
    mooniswapOracle: '0x1488a117641eD5D2D29AB3eD2397963FdEFEc25e',
    uniswapOracle: '0x826802A868fc07356b502951B5B3C1Cd7Cf6B5E6',
};

const connectors = [
    tokens.ETH,
    tokens.WETH,
    tokens.USDC,
    tokens.DAI,
    tokens.USDT,
    tokens.NONE,
    tokens['1INCH'],
    tokens.WBTC,
];

const multiWrapper = '0x931e32b6d112f7be74b16f7fbc77d491b30fe18c';

module.exports = async ({ getNamedAccounts, deployments }) => {
    console.log('running mainnet deploy script');
    console.log('network id ', await getChainId());

    const { deployer } = await getNamedAccounts();

    await idempotentDeploy(
        'OffchainOracle',
        [
            multiWrapper,
            [
                oracles.uniswapV2Oracle,
                oracles.sushiswapOracle,
                oracles.equalizerOracle,
                oracles.mooniswapOracle,
                oracles.oneInchLP1Oracle,
                oracles.uniswapOracle,
            ],
            [
                (toBN('0')).toString(),
                (toBN('0')).toString(),
                (toBN('0')).toString(),
                (toBN('2')).toString(),
                (toBN('2')).toString(),
                (toBN('1')).toString(),
            ],
            connectors,
            tokens.WETH,
        ],
        deployments,
        deployer,
    );
};

module.exports.skip = async () => true;
