const hre = require('hardhat');
const { getChainId } = hre;
const { BN } = require('@openzeppelin/test-helpers');
const { tokens } = require('../test/helpers.js');

const WXDAI = '0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d';

const HONEYSWAP_FACTORY = '0x1C232F01118CB8B424793ae03F870aa7D0ac7f77';
const HONEYSWAP_HASH = '0x3f88503e8580ab941773b59034fb4b2a63e86dbc031b3633a925533ad3ed2b93';

const LEVINSWAP_FACTORY = '0x965769C9CeA8A7667246058504dcdcDb1E2975A5';
const LEVINSWAP_HASH = '0x4955fd9146732ca7a64d43c7a8d65fe6db1acca27e9c5b3bee7c3abe5849f441';

const SWAPR_FACTORY = '0x5D48C95AdfFD4B40c1AAADc4e08fc44117E02179';
const SWAPR_HASH = '0xd306a548755b9295ee49cc729e13ca4a45e00199bbd890fa146da43a50571776';

const connectors = [
    tokens.ETH,
    WXDAI,
    tokens.NONE,
];

module.exports = async ({ getNamedAccounts, deployments }) => {
    console.log('running deploy script');
    console.log('network id ', await getChainId());

    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    const baseCoinWrapper = await deploy('BaseCoinWrapper', {
        args: [WXDAI],
        from: deployer,
    });

    console.log('wethWrapper deployed to:', baseCoinWrapper.address);

    const multiWrapper = await deploy('MultiWrapper', {
        args: [[baseCoinWrapper.address]],
        from: deployer,
    });

    console.log('multiWrapper deployed to:', multiWrapper.address);

    const honeyswapOracle = await deploy('UniswapV2LikeOracle_Honeyswap', {
        args: [HONEYSWAP_FACTORY, HONEYSWAP_HASH],
        from: deployer,
        contract: 'UniswapV2LikeOracle',
    });

    console.log('honeyswapOracle deployed to:', honeyswapOracle.address);

    const levinswapOracle = await deploy('UniswapV2LikeOracle_Levinswap', {
        args: [LEVINSWAP_FACTORY, LEVINSWAP_HASH],
        from: deployer,
        contract: 'UniswapV2LikeOracle',
    });

    console.log('levinswapOracle deployed to:', levinswapOracle.address);

    const swaprOracle = await deploy('UniswapV2LikeOracle_Swapr', {
        args: [SWAPR_FACTORY, SWAPR_HASH],
        from: deployer,
        contract: 'UniswapV2LikeOracle',
    });

    console.log('swaprOracle deployed to:', swaprOracle.address);

    const args = [
        multiWrapper.address,
        [
            honeyswapOracle.address,
            levinswapOracle.address,
            swaprOracle.address,
        ],
        [
            (new BN('0')).toString(),
            (new BN('0')).toString(),
            (new BN('0')).toString(),
        ],
        connectors,
        WXDAI,
    ];

    const offchainOracle = await deploy('OffchainOracle', {
        args: args,
        from: deployer,
        skipIfAlreadyDeployed: true,
    });

    console.log('OffchainOracle deployed to:', offchainOracle.address);
};

module.exports.skip = async () => true;
