const { Wallet } = require('zksync-web3');
const { Deployer } = require('@matterlabs/hardhat-zksync-deploy');
const { tokens } = require('../test/helpers.js');

const USDC = '0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4';
const WETH = '0x5AEa5775959fBC2557Cc8789bC1bf90A239D9a91';

const connectors = [
    tokens.ETH,
    tokens.NONE,
    WETH,
    USDC,
];

const MUTE_FACTORY = '0x40be1cBa6C5B47cDF9da7f963B6F761F4C60627D';

module.exports = async function (hre) {
    console.log('running deploy script');
    console.log('network id ', await hre.getChainId());

    // Initialize the wallet.
    const wallet = new Wallet(process.env.ZKSYNC_PRIVATE_KEY);

    // Create deployer object and load the artifact of the contract we want to deploy.
    const deployer = new Deployer(hre, wallet);

    const BaseCoinWrapper = await deployer.loadArtifact('BaseCoinWrapper');
    const baseCoinWrapper = await deployer.deploy(BaseCoinWrapper, [WETH]);
    console.log(`${BaseCoinWrapper.contractName} was deployed to ${baseCoinWrapper.address}`);
    if (await hre.getChainId() !== '31337') {
        await hre.run('verify:verify', {
            address: baseCoinWrapper.address,
            constructorArguments: [WETH],
        });
    }

    const MultiWrapper = await deployer.loadArtifact('MultiWrapper');
    const multiWrapper = await deployer.deploy(MultiWrapper, [[baseCoinWrapper.address]]);
    console.log(`${MultiWrapper.contractName} was deployed to ${multiWrapper.address}`);
    if (await hre.getChainId() !== '31337') {
        await hre.run('verify:verify', {
            address: multiWrapper.address,
            constructorArguments: [[baseCoinWrapper.address]],
        });
    }

    const SolidlyOracleNoCreate2 = await deployer.loadArtifact('SolidlyOracleNoCreate2');
    const muteOracle = await deployer.deploy(SolidlyOracleNoCreate2, [MUTE_FACTORY]);
    console.log(`${SolidlyOracleNoCreate2.contractName}Mute was deployed to ${muteOracle.address}`);
    if (await hre.getChainId() !== '31337') {
        await hre.run('verify:verify', {
            address: muteOracle.address,
            constructorArguments: [MUTE_FACTORY],
        });
    }

    const OffchainOracle = await deployer.loadArtifact('OffchainOracle');
    const offchainOracle = await deployer.deploy(OffchainOracle, [multiWrapper.address, [muteOracle.address], ['0'], connectors, WETH]);
    console.log(`${OffchainOracle.contractName} was deployed to ${offchainOracle.address}`);
    if (await hre.getChainId() !== '31337') {
        await hre.run('verify:verify', {
            address: offchainOracle.address,
            constructorArguments: [multiWrapper.address, [muteOracle.address], ['0'], connectors, WETH],
        });
    }
};

module.exports.skip = async () => true;
