const hre = require('hardhat');
const { getChainId } = hre;

const QUICKSWAP_V2_FACTORY = '0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32';
const QUICKSWAP_V2_HASH = '0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f';
const WMATIC = '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270';

module.exports = async ({ getNamedAccounts, deployments }) => {
    console.log('running deploy script');
    console.log('network id ', await getChainId());

    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    const uniswapV2Oracle = await deploy('UniswapV2LikeOracle', {
        args: [QUICKSWAP_V2_FACTORY, QUICKSWAP_V2_HASH],
        from: deployer,
        skipIfAlreadyDeployed: true,
    });

    const wethWrapper = await deploy('BaseCoinWrapper', {
        args: [WMATIC],
        from: deployer,
        skipIfAlreadyDeployed: true,
    });

    const multiWrapper = await deploy('MultiWrapper', {
        args: [[wethWrapper.address]],
        from: deployer,
        skipIfAlreadyDeployed: true,
    });

    const offchainOracle = await deploy('OffchainOracle', {
        args: [multiWrapper.address, [uniswapV2Oracle.address], []],
        from: deployer,
        skipIfAlreadyDeployed: true,
    });

    console.log('OffchainOracle deployed to:', offchainOracle.address);

    // await hre.run('verify:verify', {
    //     address: mooniswapOracle.address,
    //     constructorArguments: [INCH_LP_FACTORY_ADDR],
    // });

    // await hre.run('verify:verify', {
    //     address: uniswapV2Oracle.address,
    //     constructorArguments: [UNISWAP_V2_FACTORY, UNISWAP_V2_HASH],
    // });

    // await hre.run('verify:verify', {
    //     address: uniswapV1Oracle.address,
    //     constructorArguments: [UNISWAP_V1_FACTORY],
    // });

    // await hre.run('verify:verify', {
    //     address: wethWrapper.address,
    //     constructorArguments: [WETH],
    // });

    // await hre.run('verify:verify', {
    //     address: multiWrapper.address,
    //     constructorArguments: [[wethWrapper.address]],
    // });

    // await hre.run('verify:verify', {
    //     address: offchainOracle.address,
    //     constructorArguments: [multiWrapper.address, [mooniswapOracle.address, uniswapV2Oracle.address, uniswapV1Oracle.address], []],
    // });
};

module.exports.skip = async () => false;
