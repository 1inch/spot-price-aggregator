const { getChainId } = require('hardhat');
const {
    idempotentDeploy,
    getContract,
} = require('./utils.js');

module.exports = async ({ getNamedAccounts, deployments }) => {
    console.log('running yvault deploy script');
    console.log('network id ', await getChainId());

    const { deployer } = await getNamedAccounts();

    const multiWrapper = await getContract('MultiWrapper', deployments);

    const yvaultWrapper = await idempotentDeploy(
        'YVaultWrapper',
        [],
        deployments,
        deployer,
    );

    await (await multiWrapper.addWrapper(yvaultWrapper.address)).wait();
};

module.exports.skip = async () => true;
