const hre = require('hardhat');
const { ethers, getChainId } = hre;
const { deployAndGetContractWithCreate3, constants } = require('@1inch/solidity-utils');
const { contracts } = require('../../../test/helpers.js');

const SALT_INDEX = '';
const ADMIN_SLOT = '0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103';

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

module.exports = async ({ getNamedAccounts, deployments }) => {
    const SALT_PROD = ethers.keccak256(ethers.toUtf8Bytes('OffchainOracle' + SALT_INDEX));

    console.log('running deploy script: deploy-proxy');
    console.log('network id ', await getChainId());

    const { deployer: txSigner } = await getNamedAccounts();

    const create3Deployer = await ethers.getContractAt('ICreate3Deployer', contracts.create3Deployer);
    const implAddress = (await deployments.get('OffchainOracle')).address;
    const proxyAddress = await create3Deployer.addressOf(SALT_PROD);

    await deployAndGetContractWithCreate3({
        contractName: 'TransparentUpgradeableProxy',
        constructorArgs: [implAddress, txSigner, '0x'],
        create3Deployer: contracts.create3Deployer,
        SALT_PROD,
        deployments,
        txSigner,
    });
    await sleep(5000);

    if (!constants.DEV_CHAINS.includes(hre.network.name)) {
        if (!hre.network.zksync) {
            const proxyAdminBytes32 = await ethers.provider.send('eth_getStorageAt', [
                proxyAddress,
                ADMIN_SLOT,
                'latest',
            ]);

            await hre.run('verify:verify', {
                address: '0x' + proxyAdminBytes32.substring(26, 66),
                constructorArguments: [txSigner],
            });
        }

        await hre.run('verify:verify', {
            address: proxyAddress,
            constructorArguments: [implAddress, txSigner, '0x'],
        });
    }
};

module.exports.skip = async () => true;
