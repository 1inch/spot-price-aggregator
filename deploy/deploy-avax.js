const hre = require('hardhat');
const { getChainId, ethers } = hre;
const { BN } = require('@openzeppelin/test-helpers');
const { tokens } = require('../test/helpers.js');
const constants = require('@openzeppelin/test-helpers/src/constants');

const WAVAX = '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7';
const AAVE_LENDING_POOL = '0x4F01AeD16D97E3aB5ab2B501154DC9bb0F1A5A2C';

const JOE_FACTORY = '0x9Ad6C38BE94206cA50bb0d90783181662f0Cfa10';
const JOE_HASH = '0x0bbca9af0511ad1a1da383135cf3a8d2ac620e549ef9f6ae3a4c33c2fed0af91';
const PANGOLIN_FACTORY = '0xefa94DE7a4656D787667C749f7E1223D71E9FD88';
const PANGOLIN_HASH = '0x40231f6b438bce0797c9ada29b718a87ea0a5cea3fe9a771abdd76bd41a3e545';
const SUSHISWAP_FACTORY = '0xc35DADB65012eC5796536bD9864eD8773aBc74C4';
const SUSHISWAP_HASH = '0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303';

const WETH = '0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB';
const DAI = '0xd586E7F844cEa2F87f50152665BCbc2C279D8d70';
const USDT = '0xc7198437980c041c805A1EDcbA50c1Ce5db95118';
const USDC = '0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664';
const AAVE = '0x63a72806098Bd3D9520cC43356dD78afe5D386D9';
const WBTC = '0x50b7545627a5162F82A992c33b87aDc75187B218';
const AAWE_WRAPPER_TOKENS = [
    WETH,
    DAI,
    USDT,
    USDC,
    AAVE,
    WBTC,
    WAVAX,
];

const CONNECTORS = [
    tokens.ETH, // avax
    WAVAX,
    tokens.NONE,

    WETH,
    USDT,
    WBTC,
    USDC,
];

const delay = (ms) =>
    new Promise((resolve) => {
        setTimeout(resolve, ms);
    });

const tryRun = async (f, n = 10) => {
    if (typeof f !== 'function') {
        throw Error('f is not a function');
    }
    for (let i = 0; ; i++) {
        try {
            return await f();
        } catch (error) {
            if (error.message === 'Contract source code already verified' || error.message.includes('Reason: Already Verified')) {
                console.log('Contract already verified. Skipping verification');
                break;
            }
            console.error(error);
            await delay(1000);
            if (i > n) {
                throw new Error(`Couldn't verify deploy in ${n} runs`);
            }
        }
    }
};

const zip = (a, b) => a.map((k, i) => [k, b[i]]);

module.exports = async ({ getNamedAccounts, deployments }) => {
    console.log('running deploy script');
    console.log('network id ', await getChainId());

    const { deploy, getOrNull } = deployments;
    const { deployer } = await getNamedAccounts();

    const idempotentDeploy = async (contractName, constructorArgs, deploymentName = contractName) => {
        const existingContract = await getOrNull(deploymentName);
        if (existingContract) {
            console.log(`Skipping deploy for existing contract ${contractName} (${deploymentName})`);
            return existingContract;
        }

        const contract = await deploy(deploymentName, {
            args: constructorArgs,
            from: deployer,
            contract: contractName,
        });

        await tryRun(() => hre.run('verify:verify', {
            address: contract.address,
            constructorArguments: constructorArgs,
        }));

        return contract;
    };

    const idempotentDeployGetContract = async (contractName, constructorArgs) => {
        const deployResult = await idempotentDeploy(contractName, constructorArgs);
        const contractFactory = await ethers.getContractFactory(contractName);
        const contract = contractFactory.attach(deployResult.address);
        return contract;
    };

    const wavaxWrapper = await idempotentDeploy('BaseCoinWrapper', [WAVAX]);
    const multiWrapper = await idempotentDeployGetContract('MultiWrapper', [[wavaxWrapper.address]]);
    const aaveWrapperV2 = await idempotentDeployGetContract('AaveWrapperV2', [AAVE_LENDING_POOL]);
    const aTokens = await Promise.all(AAWE_WRAPPER_TOKENS.map(x => aaveWrapperV2.tokenToaToken(x)));
    const tokensToDeploy = zip(AAWE_WRAPPER_TOKENS, aTokens).filter(([, aToken]) => aToken === constants.ZERO_ADDRESS).map(([token]) => token);
    if (tokensToDeploy.length > 0) {
        console.log('AaveWrapperV2 tokens to deploy: ', tokensToDeploy);
        await (await aaveWrapperV2.addMarkets(tokensToDeploy)).wait();
    } else {
        console.log('All tokens are already deployed');
    }

    const existingWrappers = await multiWrapper.wrappers();
    if (!existingWrappers.includes(aaveWrapperV2.address)) {
        console.log('Adding aave wrapper');
        await (await multiWrapper.addWrapper(aaveWrapperV2.address)).wait();
    }

    const joeOracle = await idempotentDeploy('UniswapV2LikeOracle', [JOE_FACTORY, JOE_HASH], 'UniswapV2LikeOracle_Joe');
    const pangolinOracle = await idempotentDeploy('UniswapV2LikeOracle', [PANGOLIN_FACTORY, PANGOLIN_HASH], 'UniswapV2LikeOracle_Pangolin');

    const args = [
        multiWrapper.address,
        [
            joeOracle.address,
            pangolinOracle.address,
        ],
        [
            (new BN('0')).toString(),
            (new BN('0')).toString(),
        ],
        CONNECTORS,
        WAVAX,
    ];
    const offchainOracle = await idempotentDeployGetContract('OffchainOracle', args);
    console.log('OffchainOracle deployed to:', offchainOracle.address);

    // --- upd1

    const sushiOracle = await idempotentDeploy('UniswapV2LikeOracle', [SUSHISWAP_FACTORY, SUSHISWAP_HASH], 'UniswapV2LikeOracle_Sushi');
    const existingOracles = await offchainOracle.oracles();
    if (!existingOracles.allOracles.includes(sushiOracle.address)) {
        console.log('Adding sushi oracle');
        await (await offchainOracle.addOracle(sushiOracle.address, '0')).wait();
    } else {
        console.log('Sushi oracle already added');
    }

    const existingConnectors = new Set((await offchainOracle.connectors()).map(x => x.toLowerCase()));
    const conntextorsToAdd = CONNECTORS.filter(x => !existingConnectors.has(x.toLowerCase()));
    console.log('Adding connextors: ', conntextorsToAdd);
    for (const connector of conntextorsToAdd) {
        await (await offchainOracle.addConnector(connector)).wait();
        console.log('Added', connector);
    }
    console.log('All oracles:', await offchainOracle.oracles());
    console.log('All connectors:', await offchainOracle.connectors());
};

module.exports.skip = async () => false;
