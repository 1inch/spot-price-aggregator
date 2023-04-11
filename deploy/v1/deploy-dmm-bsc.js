const { getChainId } = require('hardhat');
const {
    idempotentDeploy,
    getContract,
} = require('../utils.js');

module.exports = async ({ getNamedAccounts, deployments }) => {
    console.log('running dmm-bsc deploy script');
    console.log('network id ', await getChainId());

    const { deployer } = await getNamedAccounts();

    const offchainOracle = await getContract('OffchainOracle', deployments);

    const kyberDmmOracle = await idempotentDeploy(
        'KyberDmmOracle',
        ['0x878dFE971d44e9122048308301F540910Bbd934c'],
        deployments,
        deployer,
    );

    await (await offchainOracle.addOracle(kyberDmmOracle.address, '0')).wait();
};

module.exports.skip = async () => true;
