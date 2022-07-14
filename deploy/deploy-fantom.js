const hre = require('hardhat');
const { getChainId, ethers } = hre;
const { BN } = require('@openzeppelin/test-helpers');
const { tokens } = require('../test/helpers.js');
const constants = require('@openzeppelin/test-helpers/src/constants');

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
const scWFTM = '0x0A0aD52F5B4E267a5237bdC65Da8524b1A9BF75B';

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

async function addAaveTokens (aaveWrapperV2) {
    const aTokens = await Promise.all(AAWE_WRAPPER_TOKENS.map(x => aaveWrapperV2.tokenToaToken(x)));
    const tokensToDeploy = zip(AAWE_WRAPPER_TOKENS, aTokens).filter(([, aToken]) => aToken === constants.ZERO_ADDRESS).map(([token]) => token);
    if (tokensToDeploy.length > 0) {
        console.log('AaveWrapperV2 tokens to deploy: ', tokensToDeploy);
        await (await aaveWrapperV2.addMarkets(tokensToDeploy)).wait();
    } else {
        console.log('All tokens are already deployed');
    }
}

// not idemponent. Needs to be rewritten a bit if another run is required
async function addCompoundTokens (compoundLikeWrapper, cTokens) {
    await (await compoundLikeWrapper.addMarkets(cTokens)).wait();
}

module.exports = async ({ getNamedAccounts, deployments }) => {
    console.log('running phantom deploy script');
    const chainId = await getChainId();
    console.log('network id ', chainId);
    if (chainId !== '250') {
        console.log('skipping wrong chain id deployment');
        return;
    }

    const { deploy, getOrNull } = deployments;
    const { deployer } = await getNamedAccounts();

    const idempotentDeploy = async (contractName, constructorArgs, deploymentName = contractName) => {
        const existingContract = await getOrNull(deploymentName);
        if (existingContract) {
            console.log(`Skipping deploy for existing contract ${contractName} (${deploymentName})`);
            return existingContract;
        }

        const contract = await deploy(deploymentName, {
            args: constructorArgs,
            from: deployer,
            contract: contractName,
        });

        await tryRun(() => hre.run('verify:verify', {
            address: contract.address,
            constructorArguments: constructorArgs,
        }));

        return contract;
    };

    const idempotentDeployGetContract = async (contractName, constructorArgs) => {
        const deployResult = await idempotentDeploy(contractName, constructorArgs);
        const contractFactory = await ethers.getContractFactory(contractName);
        const contract = contractFactory.attach(deployResult.address);
        return contract;
    };

    const scream = await ethers.getContractAt('IComptroller', WRAPPERS.compound.scream);
    const screamCTokens = await scream.getAllMarkets();
    console.log('Found scream cTokens', screamCTokens);

    const baseCoinWrapper = await idempotentDeploy('BaseCoinWrapper', [AAWE_WRAPPER_TOKENS.wFTM]);
    const geistWrapper = await idempotentDeployGetContract('AaveWrapperV2', [WRAPPERS.aave.geist]);
    const screamWrapper = await idempotentDeployGetContract('CompoundLikeWrapper', [WRAPPERS.compound.scream, scWFTM]);
    await addAaveTokens(geistWrapper);
    await addCompoundTokens(screamWrapper, screamCTokens);

    const multiWrapper = await idempotentDeployGetContract('MultiWrapper', [[
        baseCoinWrapper.address,
        geistWrapper.address,
        screamWrapper.address,
    ]]);

    const spookSywap = await idempotentDeploy('UniswapV2LikeOracle', [ORACLES.SpookySwap.factory, ORACLES.SpookySwap.initHash], 'UniswapV2LikeOracle_Spooky');
    const solidex = await idempotentDeploy('UniswapV2LikeOracle', [ORACLES.Solidex.factory, ORACLES.Solidex.initHash], 'UniswapV2LikeOracle_Solidex');
    const spiritSwap = await idempotentDeploy('UniswapV2LikeOracle', [ORACLES.SpiritSwap.factory, ORACLES.SpiritSwap.initHash], 'UniswapV2LikeOracle_SpiritSwap');
    const sushiSwap = await idempotentDeploy('UniswapV2LikeOracle', [ORACLES.SushiSwap.factory, ORACLES.SushiSwap.initHash], 'UniswapV2LikeOracle_SushiSwap');

    const args = [
        multiWrapper.address,
        [
            spookSywap.address,
            solidex.address,
            spiritSwap.address,
            sushiSwap.address,
        ],
        [
            (new BN('0')).toString(),
            (new BN('0')).toString(),
            (new BN('0')).toString(),
            (new BN('0')).toString(),
        ],
        CONNECTORS,
        AAWE_WRAPPER_TOKENS.wFTM,
    ];
    const offchainOracle = await idempotentDeployGetContract('OffchainOracle', args);
    console.log('OffchainOracle deployed to:', offchainOracle.address);
    console.log('All oracles:', await offchainOracle.oracles());
    console.log('All connectors:', await offchainOracle.connectors());
};

module.exports.skip = async () => true;
