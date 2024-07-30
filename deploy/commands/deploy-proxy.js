const hre = require('hardhat');
const { ethers, getChainId } = hre;
const { constants } = require('@1inch/solidity-utils');

const ADMIN_SLOT = '0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103';

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

module.exports = async ({ getNamedAccounts, deployments }) => {
    console.log('running deploy script: deploy-proxy');
    console.log('network id ', await getChainId());

    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    const implAddress = (await deployments.get('OffchainOracle')).address;

    const proxyDeployment = await deploy('TransparentUpgradeableProxy', {
        args: [implAddress, deployer, '0x'],
        from: deployer,
    });
    await sleep(5000);
    console.log('Proxy for OffchainOracle with impl at', implAddress, 'deployed to:', proxyDeployment.address);

    if (!constants.DEV_CHAINS.includes(hre.network.name)) {
        if (!hre.network.zksync) {
            const proxyAdminBytes32 = await ethers.provider.send('eth_getStorageAt', [
                proxyDeployment.address,
                ADMIN_SLOT,
                'latest',
            ]);

            await hre.run('verify:verify', {
                address: '0x' + proxyAdminBytes32.substring(26, 66),
                constructorArguments: [deployer],
            });
        }

        await hre.run('verify:verify', {
            address: proxyDeployment.address,
            constructorArguments: [implAddress, deployer, '0x'],
        });
    }
};

module.exports.skip = async () => true;
