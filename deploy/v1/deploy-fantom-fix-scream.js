const { getChainId } = require('hardhat');
const {
    deployCompoundTokenWrapper,
    getContract,
} = require('../utils.js');

const currentScreamWrapper = '0x67f0a177AE57EF82f7fD4F6c37Dc87A29aD4D2cB';

const scWFTM = '0x0A0aD52F5B4E267a5237bdC65Da8524b1A9BF75B';

const WRAPPERS = {
    compound: {
        scream: '0x260E596DAbE3AFc463e75B6CC05d8c46aCAcFB09',
    },
};

module.exports = async ({ getNamedAccounts, deployments }) => {
    console.log('running fantom script to change screamWrapper');
    const chainId = await getChainId();
    console.log('network id ', chainId);
    if (chainId !== '250') {
        console.log('skipping wrong chain id deployment');
        return;
    }

    const { deployer } = await getNamedAccounts();

    const screamWrapper = await deployCompoundTokenWrapper(WRAPPERS.compound.scream, scWFTM, deployments, deployer, 'ScreamWrapper');

    const multiWrapper = await getContract('MultiWrapper', (await deployments.get('MultiWrapper')).address);
    await multiWrapper.removeWrapper(currentScreamWrapper);
    await multiWrapper.addWrapper(screamWrapper.address);

    console.log('Removed screamWrapper:', currentScreamWrapper);
    console.log('Added screamWrapper:', screamWrapper.address);
};

module.exports.skip = async () => true;
