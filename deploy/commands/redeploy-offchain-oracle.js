const { getChainId } = require('hardhat');
const { deployAndGetContract } = require('@1inch/solidity-utils');
const { getContract } = require('../utils.js');

// Oracle+token pairs to blacklist after deployment.
// Each entry blacklists a specific token on a specific oracle,
// e.g. BNB on UniswapV1Oracle (stale/low-liquidity pool).
const OracleTokenBlacklist = {
    1: [ // Ethereum Mainnet
        {
            oracle: '0xAdF7CC69626eB6F03F4F613832C84Cf62586A6Bb', // UniswapV1Oracle
            token: '0xB8c77482e45F1F44dE1745F52C74426C631bDD52', // BNB
            description: 'UniswapV1 BNB pool has stale liquidity',
        },
    ],
};

module.exports = async ({ getNamedAccounts, deployments }) => {
    console.log('running deploy script: redeploy-offchain-oracle');
    const chainId = await getChainId();
    console.log('network id ', chainId);

    const { deployer } = await getNamedAccounts();

    const oldOffchainOracle = await getContract(deployments, 'OffchainOracle');

    const wBase = (await deployments.get('OffchainOracle')).args[4];
    const oracles = await oldOffchainOracle.oracles();

    const offchainOracle = await deployAndGetContract({
        contractName: 'OffchainOracle',
        constructorArgs: [
            await oldOffchainOracle.multiWrapper(),
            oracles.allOracles,
            oracles.oracleTypes,
            await oldOffchainOracle.connectors(),
            wBase,
            deployer,
        ],
        deployments,
        deployer,
        skipIfAlreadyDeployed: false,
    });

    // Apply oracle+token blacklist entries for this chain (skip if already set)
    const ENTIRE_ORACLE = 1; // BlackListType.ENTIRE_ORACLE
    const blacklistEntries = OracleTokenBlacklist[chainId] || [];
    for (const entry of blacklistEntries) {
        const currentType = await offchainOracle.oracleTokenBlacklisted(entry.oracle, entry.token);
        if (Number(currentType) !== 0) {
            console.log(`Already blacklisted (type=${currentType}), skipping: ${entry.description}`);
            continue;
        }
        console.log(`Blacklisting token ${entry.token} on oracle ${entry.oracle}: ${entry.description}`);
        await (await offchainOracle.setOracleTokenBlacklistType(entry.oracle, entry.token, ENTIRE_ORACLE)).wait();
    }
};

module.exports.skip = async () => true;
