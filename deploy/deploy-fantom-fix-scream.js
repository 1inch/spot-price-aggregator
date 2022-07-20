const hre = require('hardhat');
const { getChainId, ethers } = hre;

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

module.exports = async ({ getNamedAccounts, deployments }) => {
    console.log('running fantom script to change screamWrapper');
    const chainId = await getChainId();
    console.log('network id ', chainId);
    if (chainId !== '250') {
        console.log('skipping wrong chain id deployment');
        return;
    }

    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    const scream = await ethers.getContractAt('IComptroller', WRAPPERS.compound.scream);
    const screamCTokens = await scream.getAllMarkets();
    console.log('Found scream cTokens', screamCTokens);

    const screamWrapper = await deploy('ScreamWrapper', {
        args: [WRAPPERS.compound.scream, scWFTM],
        from: deployer,
        contract: 'CompoundLikeWrapper',
    });

    await tryRun(() => hre.run('verify:verify', {
        address: screamWrapper.address,
        constructorArguments: [WRAPPERS.compound.scream, scWFTM],
    }));

    const CompoundLikeWrapper = await ethers.getContractFactory('CompoundLikeWrapper');
    const compoundLikeWrapper = CompoundLikeWrapper.attach(screamWrapper.address);
    await (await compoundLikeWrapper.addMarkets(screamCTokens)).wait();

    const MultiWrapper = await ethers.getContractFactory('MultiWrapper');
    const multiWrapper = MultiWrapper.attach((await deployments.get('MultiWrapper')).address);
    await multiWrapper.removeWrapper(currentScreamWrapper);
    await multiWrapper.addWrapper(screamWrapper.address);

    console.log('Removed screamWrapper:', currentScreamWrapper);
    console.log('Added screamWrapper:', screamWrapper.address);
};

module.exports.skip = async () => true;
