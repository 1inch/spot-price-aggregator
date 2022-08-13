const { getChainId } = require('hardhat');
const {
    idempotentDeploy,
    getContract,
} = require('./utils.js');

module.exports = async ({ getNamedAccounts, deployments }) => {
    console.log('running dodo aurora deploy script');
    const chainId = await getChainId();
    console.log('network id ', chainId);
    if (chainId !== '1313161554') {
        console.log('skipping wrong chain id deployment:', chainId);
        return;
    }

    const { deployer } = await getNamedAccounts();

    const dodo = await idempotentDeploy(
        'DodoOracle',
        ['0xf50BDc9E90B7a1c138cb7935071b85c417C4cb8e'],
        deployments,
        deployer,
    );
    const dodoV2 = await idempotentDeploy(
        'DodoV2Oracle',
        ['0x5515363c0412AdD5c72d3E302fE1bD7dCBCF93Fe'],
        deployments,
        deployer,
    );

    const offchainOracle = await getContract('OffchainOracle', deployments);

    await (await offchainOracle.addOracle(dodo.address, '0')).wait();
    await (await offchainOracle.addOracle(dodoV2.address, '0')).wait();
};

module.exports.skip = async () => true;
