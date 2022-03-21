const hre = require('hardhat');
const { getChainId, ethers } = hre;
const { BN } = require('@openzeppelin/test-helpers');
const { tokens } = require('../test/helpers.js');
const constants = require('@openzeppelin/test-helpers/src/constants');

const NETWORK_TOKENS = {
    WFTM: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83',
    gFTM: '0x39b3bd37208cbade74d0fcbdbb12d606295b430a',
    gFUSDT: '0x940f41f0ec9ba1a34cf001cc03347ac092f5f6b5',
    gDAI: '0x07e6332dd090d287d3489245038daf987955dcfb',
    gUSDC: '0xe578c856933d8e1082740bf7661e379aa2a30b26',
    gETH: '0x25c130b2624cf12a4ea30143ef50c5d68cefa22f',
    gWBTC: '0x38aca5484b8603373acc6961ecd57a6a594510a3',
    gCRV: '0x690754a168b022331caa2467207c61919b3f8a98',
    gMIM: '0xc664fc7b8487a3e10824cda768c1d239f2403bbe',
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
    NETWORK_TOKENS.WFTM,
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
    if (tokensToDeploy.length < 0) {
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

    const baseCoinWrapper = await idempotentDeploy('BaseCoinWrapper', [NETWORK_TOKENS.WFTM]);
    const geistWrapper = await idempotentDeployGetContract('AaveWrapperV2', [WRAPPERS.aave.geist]);
    const screamWrapper = await idempotentDeployGetContract('CompoundLikeWrapper', [WRAPPERS.compound.scream, SCREAM]);
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
        NETWORK_TOKENS.WFTM,
    ];
    const offchainOracle = await idempotentDeployGetContract('OffchainOracle', args);
    console.log('OffchainOracle deployed to:', offchainOracle.address);
    console.log('All oracles:', await offchainOracle.oracles());
    console.log('All connectors:', await offchainOracle.connectors());
};

module.exports.skip = async () => false;
