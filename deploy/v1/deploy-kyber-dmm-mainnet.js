const { getChainId } = require('hardhat');
const {
    idempotentDeploy,
    getContract,
} = require('../utils.js');

module.exports = async ({ getNamedAccounts, deployments }) => {
    console.log('running kyber-dmm deploy script');
    console.log('network id ', await getChainId());

    const { deployer } = await getNamedAccounts();

    const kyberDmmOracle = await idempotentDeploy(
        'KyberDmmOracle',
        ['0x833e4083b7ae46cea85695c4f7ed25cdad8886de'],
        deployments,
        deployer,
    );

    const offchainOracle = await getContract('OffchainOracle', deployments);

    await (await offchainOracle.addOracle(kyberDmmOracle.address, '0')).wait();
};

module.exports.skip = async () => true;
