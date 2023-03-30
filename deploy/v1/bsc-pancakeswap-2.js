const { getChainId } = require('hardhat');
const {
    idempotentDeploy,
    getContract,
} = require('../utils.js');

const ORACLES = {
    pancakeswapV2: {
        factory: '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73',
        initHash: '0x00fb7f630766e6a796048ea87d01acd3068e8ff67d078148a3fa3f4a84f69bd5',
    },
};

module.exports = async ({ getNamedAccounts, deployments }) => {
    console.log('running pancakeswap-2 deploy script');
    console.log('network id ', await getChainId());

    const { deployer } = await getNamedAccounts();

    const pancakeV2Oracle = await idempotentDeploy(
        'UniswapV2LikeOracle',
        [ORACLES.pancakeswapV2.factory, ORACLES.pancakeswapV2.initHash],
        deployments,
        deployer,
    );

    const offchainOracle = await getContract('OffchainOracle', deployments);

    await (await offchainOracle.addOracle(pancakeV2Oracle.address, '0')).wait();
};

module.exports.skip = async () => true;
