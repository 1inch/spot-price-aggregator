const hre = require('hardhat');
const { getChainId } = hre;
const { BN } = require('@openzeppelin/test-helpers');
const { tokens } = require('../test/helpers.js');

const WETH = '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1';

const SWAPR_FACTORY = '0x359F20Ad0F42D75a5077e65F30274cABe6f4F01a';
const SWAPR_HASH = '0xd306a548755b9295ee49cc729e13ca4a45e00199bbd890fa146da43a50571776';
const SUSHI_FACTORY = '0xc35DADB65012eC5796536bD9864eD8773aBc74C4';
const SUSHI_HASH = '0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303';
const UNI_V3_HASH = '0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54';

const connectors = [
    tokens.ETH,
    WETH,
    tokens.NONE,
];

module.exports = async ({ getNamedAccounts, deployments }) => {
    console.log('running deploy script');
    console.log('network id ', await getChainId());

    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    const wethWrapper = await deploy('BaseCoinWrapper', {
        args: [WETH],
        from: deployer,
        skipIfAlreadyDeployed: true,
    });

    await hre.run('verify:verify', {
        address: wethWrapper.address,
        constructorArguments: [WETH],
    });

    const multiWrapper = await deploy('MultiWrapper', {
        args: [[wethWrapper.address]],
        from: deployer,
        skipIfAlreadyDeployed: true,
    });

    await hre.run('verify:verify', {
        address: multiWrapper.address,
        constructorArguments: [[wethWrapper.address]],
    });

    const uniswapV3Oracle = await deploy('UniswapV3Oracle', {
        args: [UNI_V3_HASH],
        from: deployer,
        skipIfAlreadyDeployed: true,
    });

    await hre.run('verify:verify', {
        address: uniswapV3Oracle.address,
        constructorArguments: [UNI_V3_HASH],
    });

    const swaprOracle = await deploy('UniswapV2LikeOracle', {
        args: [SWAPR_FACTORY, SWAPR_HASH],
        from: deployer,
        skipIfAlreadyDeployed: false,
    });

    await hre.run('verify:verify', {
        address: swaprOracle.address,
        constructorArguments: [SWAPR_FACTORY, SWAPR_HASH],
    });

    const sushiOracle = await deploy('UniswapV2LikeOracle', {
        args: [SUSHI_FACTORY, SUSHI_HASH],
        from: deployer,
        skipIfAlreadyDeployed: false,
    });

    await hre.run('verify:verify', {
        address: sushiOracle.address,
        constructorArguments: [SUSHI_FACTORY, SUSHI_HASH],
    });

    const args = [
        multiWrapper,
        [
            sushiOracle.address,
            swaprOracle.address,
            uniswapV3Oracle.address,
        ],
        [
            (new BN('0')).toString(),
            (new BN('0')).toString(),
            (new BN('0')).toString(),
        ],
        connectors,
        WETH,
    ];

    const offchainOracle = await deploy('OffchainOracle', {
        args: args,
        from: deployer,
        skipIfAlreadyDeployed: true,
    });

    await hre.run('verify:verify', {
        address: offchainOracle.address,
        constructorArguments: args,
    });

    console.log('OffchainOracle deployed to:', offchainOracle.address);
};

module.exports.skip = async () => false;
