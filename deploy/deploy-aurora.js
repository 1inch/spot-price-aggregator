const hre = require('hardhat');
const { getChainId, ethers } = hre;
const { BN } = require('@openzeppelin/test-helpers');
const { tokens } = require('../test/helpers.js');

const cETHbastion = '0x4E8fE8fd314cFC09BDb0942c5adCC37431abDCD0';
const auETHaurigami = '0xca9511B610bA5fc7E311FDeF9cE16050eE4449E9';
const WETH = '0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB';

const connectors = [
    tokens.ETH,
    tokens.NONE,
    WETH,
];

const ORACLES = {
    Trisolaris: {
        factory: '0xc66F594268041dB60507F00703b152492fb176E7',
        initHash: '0x754e1d90e536e4c1df81b7f030f47b4ca80c87120e145c294f098c83a6cb5ace',
    },
    WannaSwap: {
        factory: '0x7928D4FeA7b2c90C732c10aFF59cf403f0C38246',
        initHash: '0xa06b8b0642cf6a9298322d0c8ac3c68c291ca24dc66245cf23aa2abc33b57e21',
    },
    NearPAD: {
        factory: '0x34484b4E416f5d4B45D4Add0B6eF6Ca08FcED8f1',
        initHash: '0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303',
    },
    AuroraSwap: {
        factory: '0xC5E1DaeC2ad401eBEBdd3E32516d90Ab251A3aA3',
        initHash: '0xb919a60aa3c8bbfdcc188f8aad10c9d83aa77960d72f2586258a16c280a90ed4',
    },
};

const WRAPPERS = {
    compound: {
        bastion: '0x6De54724e128274520606f038591A00C5E94a1F6',
        aurigami: '0x817af6cfAF35BdC1A634d6cC94eE9e4c68369Aeb',
    },
};

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

// not idemponent. Needs to be rewritten a bit if another run is required
async function addCompoundTokens (compoundLikeWrapper, cTokens) {
    await (await compoundLikeWrapper.addMarkets(cTokens)).wait();
}

module.exports = async ({ getNamedAccounts, deployments }) => {
    console.log('running aurora deploy script');
    const chainId = await getChainId();
    console.log('network id ', chainId);
    if (chainId !== '1313161554') {
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

    const idempotentDeployGetContract = async (contractName, constructorArgs, deploymentName = contractName) => {
        const deployResult = await idempotentDeploy(contractName, constructorArgs, deploymentName);
        const contractFactory = await ethers.getContractFactory(contractName);
        const contract = contractFactory.attach(deployResult.address);
        return contract;
    };

    const bastion = await ethers.getContractAt('IComptroller', WRAPPERS.compound.bastion);
    const bastionCTokens = (await bastion.getAllMarkets()).filter(token => token !== cETHbastion);
    console.log('Found bastion cTokens', bastionCTokens);
    const aurigami = await ethers.getContractAt('IComptroller', WRAPPERS.compound.aurigami);
    const aurigamiCTokens = (await aurigami.getAllMarkets()).filter(token => token !== auETHaurigami);
    console.log('Found aurigami cTokens', aurigamiCTokens);

    const baseCoinWrapper = await idempotentDeploy('BaseCoinWrapper', [WETH]);
    const bastionWrapper = await idempotentDeployGetContract('CompoundLikeWrapper', [WRAPPERS.compound.bastion, cETHbastion], 'CompoundLikeWrapper_Bastion');
    await addCompoundTokens(bastionWrapper, bastionCTokens);
    const aurigamiWrapper = await idempotentDeployGetContract('CompoundLikeWrapper', [WRAPPERS.compound.aurigami, auETHaurigami], 'CompoundLikeWrapper_Aurigami');
    await addCompoundTokens(aurigamiWrapper, aurigamiCTokens);

    const multiWrapper = await idempotentDeployGetContract('MultiWrapper', [[
        baseCoinWrapper.address,
        bastionWrapper.address,
        aurigamiWrapper.address,
    ]]);

    const trisolaris = await idempotentDeploy('UniswapV2LikeOracle', [ORACLES.Trisolaris.factory, ORACLES.Trisolaris.initHash], 'UniswapV2LikeOracle_Trisolaris');
    const wannaSwap = await idempotentDeploy('UniswapV2LikeOracle', [ORACLES.WannaSwap.factory, ORACLES.WannaSwap.initHash], 'UniswapV2LikeOracle_WannaSwap');
    const nearPAD = await idempotentDeploy('UniswapV2LikeOracle', [ORACLES.NearPAD.factory, ORACLES.NearPAD.initHash], 'UniswapV2LikeOracle_NearPAD');
    const auroraSwap = await idempotentDeploy('UniswapV2LikeOracle', [ORACLES.AuroraSwap.factory, ORACLES.AuroraSwap.initHash], 'UniswapV2LikeOracle_AuroraSwap');

    const args = [
        multiWrapper.address,
        [
            trisolaris.address,
            wannaSwap.address,
            nearPAD.address,
            auroraSwap.address,
        ],
        [
            (new BN('0')).toString(),
            (new BN('0')).toString(),
            (new BN('0')).toString(),
            (new BN('0')).toString(),
        ],
        connectors,
        WETH,
    ];

    const offchainOracle = await idempotentDeploy('OffchainOracle', args);
    console.log('OffchainOracle deployed to:', offchainOracle.address);
};

module.exports.skip = async () => true;
