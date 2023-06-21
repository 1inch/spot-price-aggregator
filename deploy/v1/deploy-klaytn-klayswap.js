const { getChainId } = require('hardhat');
const { deployAndGetContract, toBN } = require('@1inch/solidity-utils');

const ORACLES = {
    Klay: {
        factory: '0xc6a2ad8cc6e4a7e08fc37cc5954be07d499e7654',
        storage: '0x1289550d988177575154c2CA45c95CCfb32F837d',
    },
};

module.exports = async ({ getNamedAccounts, deployments }) => {
    console.log('running klaytn-klayswap deploy script');
    const chainId = await getChainId();
    console.log('network id ', chainId);
    if (chainId !== '8217') {
        console.log('skipping wrong chain id deployment');
        return;
    }

    const { deployer } = await getNamedAccounts();

    const klaySwap = await deployAndGetContract({
        contractName: 'KlaySwapOracle',
        constructorArgs: [ORACLES.Klay.factory, ORACLES.Klay.storage],
        deployments,
        deployer,
    });
    const offchainOracle = await deployAndGetContract({
        contractName: 'OffchainOracle',
        constructorArgs: [],
        deployments,
        deployer,
    });
    await offchainOracle.addOracle(klaySwap.address, (toBN('0')).toString());
};

module.exports.skip = async () => true;
