const { getChainId } = require('hardhat');
const { tokens } = require('../../test/helpers.js');
const { deployAndGetContract, toBN } = require('@1inch/solidity-utils');

const WKLAY = '0xe4f05a66ec68b54a58b17c22107b02e0232cc817';

const connectors = [
    tokens.ETH,
    tokens.NONE,
    WKLAY,
];

const ORACLES = {
    ClaimSwap: {
        factory: '0x3679c3766e70133ee4a7eb76031e49d3d1f2b50c',
        initHash: '0x10e61440550fba8ac19847f73eaa43e9d8150e875dbed699274b465524bea5f1',
    },
};

const KLAP = '0x1b9c074111ec65E1342Ea844f7273D5449D2194B';

const KLAP_TOKENS = [
    '0x078db7827a5531359f6cb63f62cfa20183c4f10c', // DAI
    '0x6270b58be569a7c0b8f47594f191631ae5b2c86c', // USDC
    '0xd6dab4cff47df175349e6e7ee2bf7c40bb8c05a3', // USDT
    '0xdcbacf3f7a069922e677912998c8d57423c37dfa', // WBTC
    '0xcd6f29dc9ca217d0973d3d21bf58edd3ca871a86', // WETH
    WKLAY,
];

module.exports = async ({ getNamedAccounts, deployments }) => {
    console.log('running klaytn deploy script');
    const chainId = await getChainId();
    console.log('network id ', chainId);
    if (chainId !== '8217') {
        console.log('skipping wrong chain id deployment');
        return;
    }

    const { deployer } = await getNamedAccounts();

    const baseCoinWrapper = await deployAndGetContract({
        contractName: 'BaseCoinWrapper',
        constructorArgs: [WKLAY],
        deployments,
        deployer,
    });
    const klapWrapper = await deployAndGetContract({
        contractName: 'AaveWrapperV2',
        constructorArgs: [KLAP],
        deployments,
        deployer,
        deploymentName: 'AaveWrapperV2_Klap',
    });
    await (await klapWrapper.addMarkets(KLAP_TOKENS)).wait();
    const multiWrapper = await deployAndGetContract({
        contractName: 'MultiWrapper',
        constructorArgs: [[
            baseCoinWrapper.address,
            klapWrapper.address,
        ]],
        deployments,
        deployer,
    });

    const claimSwap = await deployAndGetContract({
        contractName: 'UniswapV2LikeOracle',
        constructorArgs: [ORACLES.ClaimSwap.factory, ORACLES.ClaimSwap.initHash],
        deployments,
        deployer,
        deploymentName: 'UniswapV2LikeOracle_ClaimSwap',
    });

    await deployAndGetContract({
        contractName: 'OffchainOracle',
        constructorArgs: [
            multiWrapper.address,
            [
                claimSwap.address,
            ],
            [
                (toBN('0')).toString(),
            ],
            connectors,
            WKLAY,
        ],
        deployments,
        deployer,
    });
};

module.exports.skip = async () => true;
