const { getChainId } = require('hardhat');
const {
    idempotentDeploy,
    getContract,
} = require('./utils.js');

module.exports = async ({ getNamedAccounts, deployments }) => {
    console.log('running uniswap-v3-mainnet deploy script');
    console.log('network id ', await getChainId());

    const { deployer } = await getNamedAccounts();

    const uniswapV3Oracle = await idempotentDeploy(
        'UniswapV3Oracle',
        ['0x1F98431c8aD98523631AE4a59f267346ea31F984', ['500', '3000', '10000']],
        deployments,
        deployer,
    );

    const offchainOracle = await getContract('OffchainOracle', deployments);

    await (await offchainOracle.addOracle(uniswapV3Oracle.address, '0')).wait();
};

module.exports.skip = async () => true;
