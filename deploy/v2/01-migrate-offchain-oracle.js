const { getChainId } = require('hardhat');
const { toBN } = require('@1inch/solidity-utils');
const { tokens } = require('../../test/helpers.js');
const {
    idempotentDeploy,
} = require('../utils.js');

const OraclesToUpdate = {
    mainnet: {
        "0x8dc76c16e90351C1574a3Eea5c5797C475eA7292": {
            contract: "UniswapV2LikeOracle",
            exchangeName: "Uniswap",
        },
        "0x4749B35AE40897B40585633261c5f743730fE8BC": {
            contract: "UniswapV2LikeOracle",
            exchangeName: "SushiSwap",
        },
        "0x37E440D480F8891B62cF61f2E36fB9503D1e3B57": {
            contract: "UniswapV2LikeOracle",
            exchangeName: "Equalizer",
        },
        "0x45Daa24D246B7780E1877781efb10a889678670d": {
            contract: "UniswapV2LikeOracle",
            exchangeName: "ShibaSwap",
        },
        "0x30829F90270eb4270d8CAdFAfcF13f1DF841be1d": {
            contract: "MooniswapOracle",
        },
        "0xf74d3A34655954F0264B068250009aEE1F06f101": {
            contract: "KyberDmmOracle",
        },
        "0x9Fba28a4A604F8116B908B646306E6Fa8BA5286F": {
            contract: "UniswapV3Oracle",
        },
        "0x826802A868fc07356b502951B5B3C1Cd7Cf6B5E6": {
            contract: "UniswapOracle",
            params: ["0xc0a47dFe034B400B47bDaD5FecDa2621de6c4d95"],
        },
    },
    optimistic: {
        "0x8266c553f269b2eEb2370539193bCD0Eff8cC2De": {
            contract: "UniswapV3Oracle",
        },
    },
};

module.exports = async ({ getNamedAccounts, deployments }) => {
    const networkName = hre.network.name;
    console.log(`running ${networkName} deploy script`);
    const chainId = await getChainId();
    console.log('network id ', chainId);
    if (chainId != hre.config.networks[networkName].chainId) {
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
        let oracle;
        let params = [];
        switch (contractName) {
            case "UniswapV2LikeOracle":
                oracle = await attachContract(contractName, oracles.allOracles[i]);
                params = [await oracle.factory(), await oracle.initcodeHash()];
                break;
            case "MooniswapOracle":
            case "KyberDmmOracle":
                oracle = await attachContract(contractName, oracles.allOracles[i]);
                params = [await oracle.factory()];
                break;
            case "UniswapOracle":
                params = OraclesToUpdate[networkName][oracles.allOracles[i]].params;
                break;
            case "UniswapV3Oracle":
                break;
        }

        const exchangeName = OraclesToUpdate[networkName][oracles.allOracles[i]].exchangeName;
        const updatedOracle = await idempotentDeploy(
            contractName,
            params,
            deployments,
            deployer,
            `${contractName}${!exchangeName ? "" : "_"+exchangeName}`,
        );
        existingOracles.push(updatedOracle.address);
        oracleTypes.push(oracles.oracleTypes[i]);
    }

    await idempotentDeploy(
        'OffchainOracle',
        [
            await offchainOracle.multiWrapper(),
            existingOracles,
            oracleTypes,
            await offchainOracle.connectors(),
            (await deployments.get('OffchainOracle')).args[4],
        ],
        deployments,
        deployer,
        'OffchainOracle',
        false,
        false,
    );
};

async function attachContract (contractName, address) {
    const Contract = await ethers.getContractFactory(contractName);
    return Contract.attach(address);
}

module.exports.skip = async () => true;
