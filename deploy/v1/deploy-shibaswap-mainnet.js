const { getChainId } = require('hardhat');
const {
    idempotentDeploy,
    getContract,
} = require('../utils.js');

const SHIBA_FACTORY = '0x115934131916c8b277dd010ee02de363c09d037c';
const SHIBA_HASH = '0x65d1a3b1e46c6e4f1be1ad5f99ef14dc488ae0549dc97db9b30afe2241ce1c7a';

module.exports = async ({ getNamedAccounts, deployments }) => {
    const chainId = await getChainId();
    console.log('running shibaswap-mainnet deploy script');
    console.log('network id ', chainId);

    if (chainId !== '1' || chainId === '31337') {
        console.log(`skipping wrong chain id deployment: ${chainId}`);
        return;
    }

    const { deployer } = await getNamedAccounts();

    const shibaOracle = await idempotentDeploy(
        'UniswapV2LikeOracle',
        [SHIBA_FACTORY, SHIBA_HASH],
        deployments,
        deployer,
        'UniswapV2LikeOracle_Shibaswap',
    );

    const offchainOracle = await getContract('OffchainOracle', deployments);

    await (await offchainOracle.addOracle(shibaOracle.address, '0')).wait();
};

module.exports.skip = async () => true;
