const { getChainId } = require('hardhat');
const { toBN } = require('@1inch/solidity-utils');
const {
    getContract,
} = require('../utils.js');

module.exports = async ({ deployments }) => {
    console.log('running klaytn-klayswap-fix deploy script');
    const chainId = await getChainId();
    console.log('network id ', chainId);
    if (chainId !== '8217') {
        console.log('skipping wrong chain id deployment');
        return;
    }

    const klaySwap = await deployments.get('KlaySwapOracle');

    const offchainOracle = await getContract('OffchainOracle', deployments);

    await offchainOracle.removeOracle(klaySwap.address, (toBN('0')).toString());
    await offchainOracle.addOracle(klaySwap.address, (toBN('1')).toString());
};

module.exports.skip = async () => true;
