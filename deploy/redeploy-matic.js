const hre = require('hardhat');
const { getChainId } = hre;
const { BN } = require('@openzeppelin/test-helpers');
const { tokens } = require('../test/helpers.js');

const oracles = {
    quickswapOracle: '0xE295aD71242373C37C5FdA7B57F26f9eA1088AFe',
    comethwapOracle: '0x4dFa40FDAA7694676899f8887A45603922609AF4',
    sushiswapOracle: '0x73F0a6927A3c04E679074e70DFb9105F453e799D',
};

const connectors = [
    tokens.ETH, // MATIC
    tokens.NONE,
    '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270', // WMATIC
];

const multiWrapper = '0x54431918cEC22932fCF97E54769F4E00f646690F';

module.exports = async ({ getNamedAccounts, deployments }) => {
    console.log('running deploy script');
    console.log('network id ', await getChainId());

    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    const args = [
        multiWrapper,
        [
            oracles.quickswapOracle,
            oracles.comethwapOracle,
            oracles.sushiswapOracle,
        ],
        [
            (new BN('0')).toString(),
            (new BN('0')).toString(),
            (new BN('0')).toString(),
        ],
        connectors,
        '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270', // WMATIC
    ];

    const offchainOracle = await deploy('OffchainOracle', {
        args: args,
        from: deployer,
        skipIfAlreadyDeployed: false,
    });

    console.log('OffchainOracle deployed to:', offchainOracle.address);

    // await hre.run('verify:verify', {
    //     address: offchainOracle.address,
    //     constructorArguments: args,
    // });
};

module.exports.skip = async () => true;
