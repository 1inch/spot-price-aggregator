const hre = require('hardhat');
const { getChainId, ethers } = hre;
const { getContract } = require('../utils.js');
const { contracts } = require('../../test/helpers.js');

const SALT_PROD = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('OffchainOracle'));

module.exports = async ({ getNamedAccounts, deployments }) => {
    console.log('running deploy script');
    console.log('network id ', await getChainId());

    const create3Deployer = await ethers.getContractAt('ICreate3Deployer', contracts.create3Deployer);
    const oldOffchainOracle = await getContract('OffchainOracle', deployments);

    const wBase = (await deployments.get('OffchainOracle')).args[4];
    const oracles = await oldOffchainOracle.oracles();
    const constructorArgs = [
        await oldOffchainOracle.multiWrapper(),
        oracles.allOracles,
        oracles.oracleTypes,
        await oldOffchainOracle.connectors(),
        wBase,
    ];

    const OffchainOracle = await ethers.getContractFactory('OffchainOracle');
    const deployDataStaging = OffchainOracle.getDeployTransaction(
        ...constructorArgs,
    ).data;

    const txnStaging = await create3Deployer.deploy(SALT_PROD, deployDataStaging);
    await txnStaging.wait();

    const offchainOracleAddress = await create3Deployer.addressOf(SALT_PROD);
    console.log(`OffchainOracle deployed to: ${offchainOracleAddress}`);

    await hre.run('verify:verify', {
        address: offchainOracleAddress,
        constructorArguments: constructorArgs,
    });
};

module.exports.skip = async () => true;
