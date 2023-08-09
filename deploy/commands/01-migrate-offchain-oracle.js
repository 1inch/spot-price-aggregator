const hre = require('hardhat');
const { deployAndGetContract } = require('@1inch/solidity-utils');
const { ethers, getChainId } = hre;

const OraclesToUpdate = {
    arbitrum: {
        '0xCCf6b19bc2419E776b6ee030044811dA846686fb': {
            contract: 'UniswapV2LikeOracle',
            exchangeName: 'SushiSwap',
        },
        '0x73F0a6927A3c04E679074e70DFb9105F453e799D': {
            contract: 'UniswapV2LikeOracle',
            exchangeName: 'DXswap',
        },
        '0x4dFa40FDAA7694676899f8887A45603922609AF4': {
            contract: 'UniswapV3Oracle',
        },
    },
    aurora: {
        '0x27950ecAeBB4462e18e8041AAF6Ea13cA47Af001': {
            contract: 'UniswapV2LikeOracle',
            exchangeName: 'Trisolaris',
        },
        '0x9488795C688d0AAe98F2056467C13a051C954657': {
            contract: 'UniswapV2LikeOracle',
            exchangeName: 'WannaSwap',
        },
        '0xE9bb60e96c40F35CdC4e84db85Ac0BFad63120ba': {
            contract: 'UniswapV2LikeOracle',
            exchangeName: 'NearPAD',
        },
        '0x929d800861d4da158A8FEdeAE119cF219658a617': {
            contract: 'UniswapV2LikeOracle',
            exchangeName: 'AuroraSwap',
        },
        '0x04098C93b15E5Cbb5A49651f20218C85F202Cd27': {
            contract: 'DodoOracle',
        },
        '0x41674e58F339fE1caB03CA8DF095D46B998E6125': {
            contract: 'DodoV2Oracle',
        },
    },
    avax: {
        '0x015f78275ef05C40A98C4c6ea75b5d6b1f7388dc': {
            contract: 'UniswapV2LikeOracle',
            exchangeName: 'Joe',
        },
        '0xA8bFB77136451D408732298392e9c37b2C54a5AA': {
            contract: 'UniswapV2LikeOracle',
            exchangeName: 'Pangolin',
        },
        '0x9632e2b35F901E372939d59C3509747C641F7693': {
            contract: 'UniswapV2LikeOracle',
            exchangeName: 'SushiSwap',
        },
    },
    bsc: {
        '0xE295aD71242373C37C5FdA7B57F26f9eA1088AFe': {
            contract: 'UniswapV2LikeOracle',
            exchangeName: 'Pancake_1',
        },
        '0xA0446D8804611944F1B527eCD37d7dcbE442caba': {
            contract: 'UniswapV2LikeOracle',
            exchangeName: 'Demax',
        },
        '0x0F85A912448279111694F4Ba4F85dC641c54b594': {
            contract: 'UniswapV2LikeOracle',
            exchangeName: 'Thugswap',
        },
        '0x3bC8E986E3fdE34D52E239145b64A7b8e7B6808C': {
            contract: 'MooniswapOracle',
        },
        '0x635ab4815EA7C3D02F42a1B9ac1f97a23644f16D': {
            contract: 'UniswapV2LikeOracle',
            exchangeName: 'BakerySwap',
        },
        '0x498BD1730DB90Ca7282AD6Feb45afBA8FF7c68a3': {
            contract: 'UniswapV2LikeOracle',
            exchangeName: 'BSCswap',
        },
        '0x30c14fAcBf36DC93c2eA4D579851F1D14Faa2d46': {
            contract: 'UniswapV2LikeOracle',
            exchangeName: 'Pancake_2',
        },
        '0x2eeA44E40930b1984F42078E836c659A12301E40': {
            contract: 'KyberDmmOracle',
        },
        '0x9bb040C4b0a26e60bE9AD2221a2C59d735655AeC': {
            contract: 'UniswapV2LikeOracle',
            exchangeName: 'ApeSwap',
        },
    },
    fantom: {
        '0xf3bC581Bc632AA0FA60F6C5f051078f77899cb71': {
            contract: 'UniswapV2LikeOracle',
            exchangeName: 'Solidex',
        },
        '0xcC59695F08EBC601EE78Dd5c5362593eDeD6292d': {
            contract: 'UniswapV2LikeOracle',
            exchangeName: 'SpiritSwap',
        },
        '0xBd0c7AaF0bF082712EbE919a9dD94b2d978f79A9': {
            contract: 'UniswapV2LikeOracle',
            exchangeName: 'Spooky',
        },
        '0x142DB045195CEcaBe415161e1dF1CF0337A4d02E': {
            contract: 'UniswapV2LikeOracle',
            exchangeName: 'SushiSwap',
        },
    },
    klaytn: {
        '0x735247fb0a604c0adC6cab38ACE16D0DbA31295F': {
            contract: 'UniswapV2LikeOracle',
            exchangeName: 'ClaimSwap',
        },
        '0x26271DFdDBD250014F87F0F302C099d5a798BaB1': {
            contract: 'KlaySwapOracle',
        },
    },
    mainnet: {
        '0x8dc76c16e90351C1574a3Eea5c5797C475eA7292': {
            contract: 'UniswapV2LikeOracle',
            exchangeName: 'Uniswap',
        },
        '0x4749B35AE40897B40585633261c5f743730fE8BC': {
            contract: 'UniswapV2LikeOracle',
            exchangeName: 'SushiSwap',
        },
        '0x37E440D480F8891B62cF61f2E36fB9503D1e3B57': {
            contract: 'UniswapV2LikeOracle',
            exchangeName: 'Equalizer',
        },
        '0x45Daa24D246B7780E1877781efb10a889678670d': {
            contract: 'UniswapV2LikeOracle',
            exchangeName: 'ShibaSwap',
        },
        '0x30829F90270eb4270d8CAdFAfcF13f1DF841be1d': {
            contract: 'MooniswapOracle',
        },
        '0xf74d3A34655954F0264B068250009aEE1F06f101': {
            contract: 'KyberDmmOracle',
        },
        '0x9Fba28a4A604F8116B908B646306E6Fa8BA5286F': {
            contract: 'UniswapV3Oracle',
        },
        '0x826802A868fc07356b502951B5B3C1Cd7Cf6B5E6': {
            contract: 'UniswapOracle',
            params: ['0xc0a47dFe034B400B47bDaD5FecDa2621de6c4d95'],
        },
    },
    matic: {
        '0xE295aD71242373C37C5FdA7B57F26f9eA1088AFe': {
            contract: 'UniswapV2LikeOracle',
            exchangeName: 'QuickSwap',
        },
        '0x4dFa40FDAA7694676899f8887A45603922609AF4': {
            contract: 'UniswapV2LikeOracle',
            exchangeName: 'ComethSwap',
        },
        '0x73F0a6927A3c04E679074e70DFb9105F453e799D': {
            contract: 'UniswapV2LikeOracle',
            exchangeName: 'SushiSwap',
        },
        '0xD41B24bbA51fAc0E4827b6F94C0D6DDeB183cD64': {
            contract: 'UniswapV2LikeOracle',
            exchangeName: 'DFYN',
        },
        '0x8e8e48829A49A63Af9E6733D52BDb15ecBB65934': {
            contract: 'UniswapV3Oracle',
        },
    },
    optimistic: {
        '0x8266c553f269b2eEb2370539193bCD0Eff8cC2De': {
            contract: 'UniswapV3Oracle',
        },
        '0xD7936052D1e096d48C81Ef3918F9Fd6384108480': {
            contract: 'SolidlyOracle',
            exchangeName: 'Velodrome',
        },
        '0x0F85A912448279111694F4Ba4F85dC641c54b594': {
            contract: 'SynthetixOracle',
        },
    },
    xdai: {
        '0x9632e2b35F901E372939d59C3509747C641F7693': {
            contract: 'UniswapV2LikeOracle',
            exchangeName: 'Honeyswap',
        },
        '0xA8bFB77136451D408732298392e9c37b2C54a5AA': {
            contract: 'UniswapV2LikeOracle',
            exchangeName: 'Levinswap',
        },
        '0x3e55Bb9383186d978Db33BB796FAcBfcb2C491A1': {
            contract: 'UniswapV2LikeOracle',
            exchangeName: 'SushiSwap',
        },
        '0x015f78275ef05C40A98C4c6ea75b5d6b1f7388dc': {
            contract: 'UniswapV2LikeOracle',
            exchangeName: 'Swapr',
        },
    },
};

module.exports = async ({ getNamedAccounts, deployments }) => {
    const networkName = hre.network.name;
    console.log(`running ${networkName} deploy script`);
    const chainId = await getChainId();
    console.log('network id ', chainId);
    if (chainId !== hre.config.networks[networkName].chainId.toString()) {
        console.log(`network chain id: ${hre.config.networks[networkName].chainId}, your chain id ${chainId}`);
        console.log('skipping wrong chain id deployment');
        return;
    }

    const { deployer } = await getNamedAccounts();

    const OffchainOracle = await ethers.getContractFactory('OffchainOracle');
    const offchainOracle = OffchainOracle.attach((await deployments.get('OffchainOracle')).address);
    const oracles = await offchainOracle.oracles();
    const oracleAddressesToUpdate = Object.keys(OraclesToUpdate[networkName]);

    const existingOracles = [];
    const oracleTypes = [];
    for (let i = 0; i < oracles.allOracles.length; i++) {
        if (oracleAddressesToUpdate.indexOf(oracles.allOracles[i]) === -1) {
            existingOracles.push(oracles.allOracles[i]);
            oracleTypes.push(oracles.oracleTypes[i]);
            continue;
        }

        const contractName = OraclesToUpdate[networkName][oracles.allOracles[i]].contract;
        const exchangeName = OraclesToUpdate[networkName][oracles.allOracles[i]].exchangeName;
        let oracle;
        let isNoDeployments = false;
        let params = [];
        try {
            params = (await deployments.get(`${contractName}${!exchangeName ? '' : '_' + exchangeName}`)).args;
        } catch {
            if (OraclesToUpdate[networkName][oracles.allOracles[i]].params) {
                params = OraclesToUpdate[networkName][oracles.allOracles[i]].params;
            } else {
                isNoDeployments = true;
            }
        }

        if (isNoDeployments) {
            switch (contractName) {
            case 'UniswapV2LikeOracle':
            case 'SolidlyOracle':
                oracle = await attachContract(contractName, oracles.allOracles[i]);
                params = [await oracle.factory(), await oracle.initcodeHash()];
                break;
            case 'MooniswapOracle':
            case 'KyberDmmOracle':
                oracle = await attachContract(contractName, oracles.allOracles[i]);
                params = [await oracle.factory()];
                break;
            case 'UniswapOracle':
                params = OraclesToUpdate[networkName][oracles.allOracles[i]].params;
                break;
            case 'UniswapV3Oracle':
                break;
            }
        }

        const updatedOracle = await deployAndGetContract({
            contractName,
            constructorArgs: params,
            deployments,
            deployer,
            deploymentName: `${contractName}${!exchangeName ? '' : '_' + exchangeName}`,
            skipIfAlreadyDeployed: !!OraclesToUpdate[networkName][oracles.allOracles[i]].skipDeploy,
        });
        existingOracles.push(updatedOracle.address);
        oracleTypes.push(oracles.oracleTypes[i]);
    }

    await deployAndGetContract({
        contractName: 'OffchainOracle',
        constructorArgs: [
            await offchainOracle.multiWrapper(),
            existingOracles,
            oracleTypes,
            await offchainOracle.connectors(),
            (await deployments.get('OffchainOracle')).args[4],
        ],
        deployments,
        deployer,
        deploymentName: 'OffchainOracle',
        skipIfAlreadyDeployed: false,
    });
};

async function attachContract (contractName, address) {
    const Contract = await ethers.getContractFactory(contractName);
    return Contract.attach(address);
}

module.exports.skip = async () => true;
