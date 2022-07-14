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
