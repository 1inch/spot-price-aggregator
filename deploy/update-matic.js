const { getChainId, ethers } = require('hardhat');

const CONNECTORS = [
    '0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF',
    '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
    '0x0000000000000000000000000000000000000000',
];

module.exports = async ({ deployments }) => {
    console.log('running deploy script');
    console.log('network id ', await getChainId());

    const OffchainOracle = await ethers.getContractFactory('OffchainOracle');
    const offchainOracle = OffchainOracle.attach((await deployments.get('OffchainOracle')).address);

    const txns = [];
    for (const connector of CONNECTORS) {
        txns.push(await offchainOracle.addConnector(connector));
    }
};

module.exports.skip = async () => true;
