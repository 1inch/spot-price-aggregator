const { getChainId } = require('hardhat');
const {
    idempotentDeploy,
    getContract,
} = require('./utils.js');

module.exports = async ({ getNamedAccounts, deployments }) => {
    console.log('running synthetix-optimistic deploy script');
    console.log('network id ', await getChainId());

    const { deployer } = await getNamedAccounts();

    const synthetixOracle = await idempotentDeploy(
        'SynthetixOracle',
        ['0x1Cb059b7e74fD21665968C908806143E744D5F30'],
        deployments,
        deployer,
        'SynthetixOracle',
        false, // skipVerify
    );

    const offchainOracle = await getContract('OffchainOracle', deployments);

    await (await offchainOracle.addOracle(synthetixOracle.address, '1')).wait();
};

module.exports.skip = async () => true;
