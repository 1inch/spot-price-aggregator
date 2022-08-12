const { getChainId } = require('hardhat');

const {
    idempotentDeploy,
    getContract,
} = require('./utils.js');

module.exports = async ({ getNamedAccounts, deployments }) => {
    console.log('running uniswap-v3 deploy script');
    console.log('network id ', await getChainId());

    const { deployer } = await getNamedAccounts();

    const offchainOracle = await getContract('OffchainOracle', deployments);
    const oldUniswapV3Oracle = await getContract('UniswapV3Oracle', deployments);

    const uniswapV3Oracle = await idempotentDeploy(
        'UniswapV3Oracle',
        [],
        deployments,
        deployer,
    );

    await (await offchainOracle.removeOracle(oldUniswapV3Oracle.address, '0')).wait();
    await (await offchainOracle.addOracle(uniswapV3Oracle.address, '0')).wait();
};

module.exports.skip = async () => true;
