const { getChainId } = require('hardhat');
const {
    idempotentDeploy,
    getContract,
} = require('./utils.js');

module.exports = async ({ getNamedAccounts, deployments }) => {
    console.log('running deploy script');
    console.log('network id ', await getChainId());

    const { deployer } = await getNamedAccounts();

    const chainlinkOracle = await idempotentDeploy(
        'chainlinkOracle',
        ['0x47Fb2585D2C56Fe188D0E6ec628a38b74fCeeeDf'],
        deployments,
        deployer,
    );

    const offchainOracle = await getContract('OffchainOracle', deployments);

    await (await offchainOracle.addOracle(chainlinkOracle.address, '1')).wait();
    await (await offchainOracle.removeOracle('0xE245a79Ce6B3968c6C59F3F1610F9FaB28196143', '1')).wait();
};

module.exports.skip = async () => true;
