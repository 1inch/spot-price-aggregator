const hre = require('hardhat');
const { getChainId, ethers } = hre;

const offchainOracle = '0xE8E598A1041b6fDB13999D275a202847D9b654ca';
const currentScreamWrapper = '0x67f0a177AE57EF82f7fD4F6c37Dc87A29aD4D2cB';

const scWFTM = '0x0A0aD52F5B4E267a5237bdC65Da8524b1A9BF75B';

const WRAPPERS = {
    compound: {
        scream: '0x260E596DAbE3AFc463e75B6CC05d8c46aCAcFB09',
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
    console.log('running fantom script to change screamWrapper');
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

    const screamWrapper = await idempotentDeployGetContract('CompoundLikeWrapper', [WRAPPERS.compound.scream, scWFTM]);
    await addCompoundTokens(screamWrapper, screamCTokens);

    const oracle = await ethers.getContractAt('OffchainOracle', offchainOracle);
    const multiWrapper = await oracle.multiWrapper();
    await multiWrapper.removeWrapper(currentScreamWrapper);
    await multiWrapper.addWrapper(screamWrapper);

    console.log('multiWrapper address:', multiWrapper.address);
    console.log('Removed screamWrapper:', currentScreamWrapper.address);
    console.log('Added screamWrapper:', screamWrapper.address);
};

module.exports.skip = async () => true;
