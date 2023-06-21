const { getChainId, ethers } = require('hardhat');
const { deployAndGetContract } = require('@1inch/solidity-utils');
const { getContract } = require('../utils.js');

const ORACLES = {
    Cometh: {
        factory: '0x800b052609c355cA8103E06F022aA30647eAd60a',
        initHash: '0x499154cad90a3563f914a25c3710ed01b9a43b8471a35ba8a66a056f37638542',
    },
    Sushi: {
        factory: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4',
        initHash: '0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303',
    },
    Aave: {
        letdingPool: '0x8dFf5E27EA6b7AC08EbFdf9eB090F32ee9a30fcf',
    },
};

const AAVE_TOKENS = [
    '0xD6DF932A45C0f255f85145f286eA0b292B21C90B', // AAVE
    '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063', // DAI
    '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', // USDC
    '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', // USDT
    '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6', // WBTC
    '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619', // WETH
    '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270', // WMATIC
];

module.exports = async ({ getNamedAccounts, deployments }) => {
    console.log('running matic-2 deploy script');
    console.log('network id ', await getChainId());

    const { deployer } = await getNamedAccounts();

    const multiWrapper = await getContract('MultiWrapper', deployments);
    const offchainOracle = await getContract('OffchainOracle', deployments);

    const cometh = await deployAndGetContract({
        contractName: 'UniswapV2LikeOracle',
        constructorArgs: [ORACLES.Cometh.factory, ORACLES.Cometh.initHash],
        deployments,
        deployer,
    });

    const sushi = await deployAndGetContract({
        contractName: 'UniswapV2LikeOracle',
        constructorArgs: [ORACLES.Sushi.factory, ORACLES.Sushi.initHash],
        deployments,
        deployer,
    });

    const AaveWrapperV2 = await ethers.getContractFactory('AaveWrapperV2');
    const aaveDeployment = await deployAndGetContract({
        contractName: 'AaveWrapperV2',
        constructorArgs: [ORACLES.Aave.letdingPool],
        deployments,
        deployer,
    });
    const aave = AaveWrapperV2.attach(aaveDeployment.address);

    await (await offchainOracle.addOracle(cometh.address, '0')).wait();
    await (await offchainOracle.addOracle(sushi.address, '0')).wait();
    await (await aave.addMarkets(AAVE_TOKENS)).wait();
    await (await multiWrapper.addWrapper(aave.address)).wait();
};

module.exports.skip = async () => true;
