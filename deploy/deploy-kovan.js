const hre = require('hardhat');
const { getChainId } = hre;

const INCH_LP_FACTORY_ADDR = '0x2Be171963835b6d21202b62EEE54c67910680129';
const UNISWAP_V2_FACTORY = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f';
const UNISWAP_V2_HASH = '0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f';
const UNISWAP_V1_FACTORY = '0xECc6C0542710a0EF07966D7d1B10fA38bbb86523';
const WETH = '0xd0A1E359811322d97991E03f863a0C30C2cF029C';

module.exports = async ({ getNamedAccounts, deployments }) => {
    console.log('running deploy script');
    console.log('network id ', await getChainId());

    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    const mooniswapOracle = await deploy('MooniswapOracle', {
        args: [INCH_LP_FACTORY_ADDR],
        from: deployer,
        skipIfAlreadyDeployed: true,
    });

    const uniswapV2Oracle = await deploy('UniswapV2LikeOracle', {
        args: [UNISWAP_V2_FACTORY, UNISWAP_V2_HASH],
        from: deployer,
        skipIfAlreadyDeployed: true,
    });

    const uniswapV1Oracle = await deploy('UniswapOracle', {
        args: [UNISWAP_V1_FACTORY],
        from: deployer,
        skipIfAlreadyDeployed: true,
    });

    const wethWrapper = await deploy('BaseCoinWrapper', {
        args: [WETH],
        from: deployer,
        skipIfAlreadyDeployed: true,
    });

    const multiWrapper = await deploy('MultiWrapper', {
        args: [[wethWrapper.address]],
        from: deployer,
        skipIfAlreadyDeployed: true,
    });

    const offchainOracle = await deploy('OffchainOracle', {
        args: [multiWrapper.address, [mooniswapOracle.address, uniswapV2Oracle.address, uniswapV1Oracle.address], []],
        from: deployer,
        skipIfAlreadyDeployed: true,
    });

    console.log('OffchainOracle deployed to:', offchainOracle.address);

    await hre.run('verify:verify', {
        address: mooniswapOracle.address,
        constructorArguments: [INCH_LP_FACTORY_ADDR],
    });

    await hre.run('verify:verify', {
        address: uniswapV2Oracle.address,
        constructorArguments: [UNISWAP_V2_FACTORY, UNISWAP_V2_HASH],
    });

    await hre.run('verify:verify', {
        address: uniswapV1Oracle.address,
        constructorArguments: [UNISWAP_V1_FACTORY],
    });

    await hre.run('verify:verify', {
        address: wethWrapper.address,
        constructorArguments: [WETH],
    });

    await hre.run('verify:verify', {
        address: multiWrapper.address,
        constructorArguments: [[wethWrapper.address]],
    });

    await hre.run('verify:verify', {
        address: offchainOracle.address,
        constructorArguments: [multiWrapper.address, [mooniswapOracle.address, uniswapV2Oracle.address, uniswapV1Oracle.address], []],
    });
};

module.exports.skip = async () => true;
