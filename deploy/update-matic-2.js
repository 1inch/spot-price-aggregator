const { getChainId, ethers } = require('hardhat');

const COMETH_FACTORY = '0x800b052609c355cA8103E06F022aA30647eAd60a';
const COMETH_HASH = '0x499154cad90a3563f914a25c3710ed01b9a43b8471a35ba8a66a056f37638542';
const SUSHI_FACTORY = '0xc35DADB65012eC5796536bD9864eD8773aBc74C4';
const SUSHI_HASH = '0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303';
const AAVE_LENDING_POOL = '0x8dFf5E27EA6b7AC08EbFdf9eB090F32ee9a30fcf';

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
    console.log('running deploy script');
    console.log('network id ', await getChainId());

    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    const AaveWrapperV2 = await ethers.getContractFactory('AaveWrapperV2');
    const OffchainOracle = await ethers.getContractFactory('OffchainOracle');
    const MultiWrapper = await ethers.getContractFactory('MultiWrapper');
    const offchainOracle = OffchainOracle.attach((await deployments.get('OffchainOracle')).address);
    const multiWrapper = MultiWrapper.attach((await deployments.get('MultiWrapper')).address);

    const cometh = await deploy('UniswapV2LikeOracle', {
        args: [COMETH_FACTORY, COMETH_HASH],
        from: deployer,
        skipIfAlreadyDeployed: false,
    });

    const sushi = await deploy('UniswapV2LikeOracle', {
        args: [SUSHI_FACTORY, SUSHI_HASH],
        from: deployer,
        skipIfAlreadyDeployed: false,
    });

    const aaveDeployment = await deploy('AaveWrapperV2', {
        args: [AAVE_LENDING_POOL],
        from: deployer,
        skipIfAlreadyDeployed: true,
    });

    const aave = AaveWrapperV2.attach(aaveDeployment.address);

    const txns = [];

    txns.push(await offchainOracle.addOracle(cometh.address));
    txns.push(await offchainOracle.addOracle(sushi.address));
    txns.push(await aave.addMarkets(AAVE_TOKENS));
    txns.push(await multiWrapper.addWrapper(aave.address));

    await Promise.all(txns);
};

module.exports.skip = async () => true;
