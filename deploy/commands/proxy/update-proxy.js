const hre = require('hardhat');
const { ethers, getChainId } = hre;

const ADMIN_SLOT = '0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103';

module.exports = async ({ deployments }) => {
    console.log('running deploy script: proxy/update-proxy');
    console.log('network id ', await getChainId());

    const implAddress = (await deployments.get('OffchainOracle')).address;
    const proxyAddress = (await deployments.get('TransparentUpgradeableProxy')).address;

    const adminAddress = '0x' + (await ethers.provider.send('eth_getStorageAt', [
        proxyAddress,
        ADMIN_SLOT,
        'latest',
    ])).substring(26, 66);
    const admin = await ethers.getContractAt('ProxyAdmin', adminAddress);

    const upgradeTxn = await admin.upgradeAndCall(proxyAddress, implAddress, '0x');
    await upgradeTxn.wait();

    console.log('Proxy for OffchainOracle at', proxyAddress, 'upgraded with new impl at', implAddress);
};

module.exports.skip = async () => true;
