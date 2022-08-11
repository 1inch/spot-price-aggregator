const hre = require('hardhat');
const { getChainId, ethers } = hre;
const { BN } = require('@openzeppelin/test-helpers');

module.exports = async ({ deployments }) => {
    console.log('running klaytn deploy script');
    const chainId = await getChainId();
    console.log('network id ', chainId);
    if (chainId !== '8217') {
        console.log('skipping wrong chain id deployment');
        return;
    }

    const klaySwap = await deployments.get('KlaySwapOracle');
    const OffchainOracle = await ethers.getContractFactory('OffchainOracle');
    const offchainOracle = OffchainOracle.attach((await deployments.get('OffchainOracle')).address);
    await offchainOracle.removeOracle(klaySwap.address, (new BN('0')).toString());
    await offchainOracle.addOracle(klaySwap.address, (new BN('1')).toString());
};

module.exports.skip = async () => true;
