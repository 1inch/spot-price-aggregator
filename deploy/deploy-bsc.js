const hre = require('hardhat');
const { getChainId } = hre;
const { BN } = require('@openzeppelin/test-helpers');
const { tokens } = require('../test/helpers.js');

const oracles = {
    pancakeswapOracle: '0xE295aD71242373C37C5FdA7B57F26f9eA1088AFe',
    demaxSwapOracle: '0xA0446D8804611944F1B527eCD37d7dcbE442caba',
    streetswapOracle: '0x0F85A912448279111694F4Ba4F85dC641c54b594',
    oneInchLP1Oracle: '0x3bC8E986E3fdE34D52E239145b64A7b8e7B6808C',
    julswapOracle: '0x635ab4815EA7C3D02F42a1B9ac1f97a23644f16D',
    bakeryswapOracle: '0x498BD1730DB90Ca7282AD6Feb45afBA8FF7c68a3',
    pancakeswap2Oracle: '0x30c14fAcBf36DC93c2eA4D579851F1D14Faa2d46',
};

const connectors = [
    tokens.ETH,  // BNB
    tokens.NONE,
    '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',  // WBNB
    '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3',  // DAI
    '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',  // ETH
    '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',  // USDC
    '0x55d398326f99059fF775485246999027B3197955',  // USDT
    '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',  // BUSD
];

const multiWrapper = '0xA31bB36c5164B165f9c36955EA4CcBaB42B3B28E';

module.exports = async ({ getNamedAccounts, deployments }) => {
    console.log('running deploy script');
    console.log('network id ', await getChainId());

    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    const args = [
        multiWrapper,
        [
            oracles.pancakeswapOracle,
            oracles.demaxSwapOracle,
            oracles.streetswapOracle,
            oracles.oneInchLP1Oracle,
            oracles.julswapOracle,
            oracles.bakeryswapOracle,
            oracles.pancakeswap2Oracle,
        ],
        [
            (new BN('0')).toString(),
            (new BN('0')).toString(),
            (new BN('0')).toString(),
            (new BN('2')).toString(),
            (new BN('0')).toString(),
            (new BN('0')).toString(),
            (new BN('0')).toString(),
        ],
        connectors,
        '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',  // WBNB
    ];

    const offchainOracle = await deploy('OffchainOracle', {
        args: args,
        from: deployer,
        skipIfAlreadyDeployed: false,
    });

    console.log('OffchainOracle deployed to:', offchainOracle.address);

    await hre.run('verify:verify', {
        address: offchainOracle.address,
        constructorArguments: args,
    });
};

module.exports.skip = async () => true;
