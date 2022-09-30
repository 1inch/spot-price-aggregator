const { getChainId } = require('hardhat');
const {
    idempotentDeploy,
    getContract,
} = require('./utils.js');

const OLD_YVAULT_WRAPPER = '0x910b9ba6a775e060a6f8dbee86f536a1e8f26021';

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

    await (await multiWrapper.removeWrapper(OLD_YVAULT_WRAPPER)).wait();
    await (await multiWrapper.addWrapper(yvaultWrapper.address)).wait();
};

module.exports.skip = async () => true;
