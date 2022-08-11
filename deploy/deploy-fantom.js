const { getChainId } = require('hardhat');
const { toBN } = require('@1inch/solidity-utils');
const {
    idempotentDeploy,
    idempotentDeployGetContract,
    deployCompoundTokenWrapper,
    addAaveTokens,
} = require('./utils.js');
const { tokens } = require('../test/helpers.js');

const NETWORK_TOKENS = {
    DAI: '0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e',
    ETH: '0x74b23882a30290451a17c44f4f05243b6b58c76d',
    wFTM: '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83',
    BTC: '0x321162cd933e2be498cd2267a90534a804051b11',
    fUSDT: '0x049d68029688eabf473097a2fc38ef61633a3c7a',
    USDC: '0x04068da6c83afcfa0e13ba15a6696662335d5b75',
    CRV: '0x1e4f97b9f9f913c46f1632781732927b9019c68b',
    MIM: '0x82f0b8b456c1a451378467398982d4834b6829c1',
    LINK: '0xb3654dc3d10ea7645f8319668e8f54d2574fbdc8',
};

const AAWE_WRAPPER_TOKENS = Object.values(NETWORK_TOKENS);
const SCREAM = '0xe0654C8e6fd4D733349ac7E09f6f23DA256bF475';

const ORACLES = {
    SpookySwap: {
        factory: '0x152eE697f2E276fA89E96742e9bB9aB1F2E61bE3',
        initHash: '0xcdf2deca40a0bd56de8e3ce5c7df6727e5b1bf2ac96f283fa9c4b3e6b42ea9d2',
    },
    Solidex: {
        factory: '0x3fAaB499b519fdC5819e3D7ed0C26111904cbc28',
        initHash: '0x57ae84018c47ebdaf7ddb2d1216c8c36389d12481309af65428eb6d460f747a4',
    },
    SpiritSwap: {
        factory: '0xEF45d134b73241eDa7703fa787148D9C9F4950b0',
        initHash: '0xe242e798f6cee26a9cb0bbf24653bf066e5356ffeac160907fe2cc108e238617',
    },
    SushiSwap: {
        factory: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4',
        initHash: '0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303',
    },
};

const WRAPPERS = {
    aave: {
        geist: '0x9FAD24f572045c7869117160A571B2e50b10d068',
    },
    compound: {
        scream: '0x260E596DAbE3AFc463e75B6CC05d8c46aCAcFB09',
    },
};

const CONNECTORS = [
    tokens.ETH,
    AAWE_WRAPPER_TOKENS.wFTM,
    tokens.NONE,

    // TODO: add custom connectors
];

module.exports = async ({ getNamedAccounts, deployments }) => {
    console.log('running phantom deploy script');
    const chainId = await getChainId();
    console.log('network id ', chainId);
    if (chainId !== '250') {
        console.log('skipping wrong chain id deployment');
        return;
    }

    const { deployer } = await getNamedAccounts();

    const screamWrapper = await deployCompoundTokenWrapper(WRAPPERS.compound.scream, SCREAM, deployments, deployer, 'CompoundLikeWrapper');

    const baseCoinWrapper = await idempotentDeploy('BaseCoinWrapper', [AAWE_WRAPPER_TOKENS.wFTM], deployments, deployer);
    const geistWrapper = await idempotentDeployGetContract('AaveWrapperV2', [WRAPPERS.aave.geist], deployments, deployer);

    await addAaveTokens(geistWrapper, AAWE_WRAPPER_TOKENS);

    const multiWrapper = await idempotentDeployGetContract(
        'MultiWrapper',
        [[
            baseCoinWrapper.address,
            geistWrapper.address,
            screamWrapper.address,
        ]],
        deployments,
        deployer,
    );

    const spookSywap = await idempotentDeploy('UniswapV2LikeOracle', [ORACLES.SpookySwap.factory, ORACLES.SpookySwap.initHash], deployments, deployer, 'UniswapV2LikeOracle_Spooky');
    const solidex = await idempotentDeploy('UniswapV2LikeOracle', [ORACLES.Solidex.factory, ORACLES.Solidex.initHash], deployments, deployer, 'UniswapV2LikeOracle_Solidex');
    const spiritSwap = await idempotentDeploy('UniswapV2LikeOracle', [ORACLES.SpiritSwap.factory, ORACLES.SpiritSwap.initHash], deployments, deployer, 'UniswapV2LikeOracle_SpiritSwap');
    const sushiSwap = await idempotentDeploy('UniswapV2LikeOracle', [ORACLES.SushiSwap.factory, ORACLES.SushiSwap.initHash], deployments, deployer, 'UniswapV2LikeOracle_SushiSwap');

    const args = [
        multiWrapper.address,
        [
            spookSywap.address,
            solidex.address,
            spiritSwap.address,
            sushiSwap.address,
        ],
        [
            (toBN('0')).toString(),
            (toBN('0')).toString(),
            (toBN('0')).toString(),
            (toBN('0')).toString(),
        ],
        CONNECTORS,
        AAWE_WRAPPER_TOKENS.wFTM,
    ];
    const offchainOracle = await idempotentDeployGetContract('OffchainOracle', args);
    console.log('All oracles:', await offchainOracle.oracles());
    console.log('All connectors:', await offchainOracle.connectors());
};

module.exports.skip = async () => true;
