const { getChainId } = require('hardhat');
const {
    idempotentDeploy,
    getContract,
} = require('./utils.js');
const { toBN } = require('@1inch/solidity-utils');
const { assertRoughlyEqualValues } = require('../test/helpers.js');

const ORACLES = {
    VelodromeFinance: {
        factory: '0x25cbddb98b35ab1ff77413456b31ec81a6b6b746',
        initHash: '0xc1ac28b1c4ebe53c0cff67bab5878c4eb68759bb1e9f73977cd266b247d149f0',
    },
};

const NETWORK_TOKENS = {
    NONE: '0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF',
    DAI: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
    WETH: '0x4200000000000000000000000000000000000006',
    WBTC: '0x68f180fcce6836688e9084f035309e29bf0a2095',
    USDT: '0x94b008aa00579c1307b0ef2c499ad98a8ce58e58',
    USDC: '0x7f5c764cbc14f9669b88837ca1490cca17c31607',
};

const testRates = {};

const getPrices = async (offchainOracle, step = 0) => {
    testRates[step] = testRates[step] || {};
    testRates[step].USDC_DAI_NONE = await offchainOracle.getRate(NETWORK_TOKENS.USDC, NETWORK_TOKENS.DAI, NETWORK_TOKENS.NONE);
    testRates[step].DAI_USDC_NONE = await offchainOracle.getRate(NETWORK_TOKENS.DAI, NETWORK_TOKENS.USDC, NETWORK_TOKENS.NONE);
    testRates[step].WBTC_USDT_NONE = await offchainOracle.getRate(NETWORK_TOKENS.WBTC, NETWORK_TOKENS.USDT, NETWORK_TOKENS.NONE);
    testRates[step].USDT_WBTC_NONE = await offchainOracle.getRate(NETWORK_TOKENS.USDT, NETWORK_TOKENS.WBTC, NETWORK_TOKENS.NONE);
    testRates[step].WBTC_USDT_WETH = await offchainOracle.getRate(NETWORK_TOKENS.WBTC, NETWORK_TOKENS.USDT, NETWORK_TOKENS.WETH);
    testRates[step].USDT_WBTC_WETH = await offchainOracle.getRate(NETWORK_TOKENS.USDT, NETWORK_TOKENS.WBTC, NETWORK_TOKENS.WETH);
    console.log(`Prices with step '${step}':`);
    console.log(`
        USDC -> DAI\t\t ${testRates[step].USDC_DAI_NONE.toString()}
        DAI -> USDC\t\t ${testRates[step].DAI_USDC_NONE.toString()}
        WBTC -> USDT\t\t ${testRates[step].WBTC_USDT_NONE.toString()}
        USDT -> WBTC\t\t ${testRates[step].USDT_WBTC_NONE.toString()}
        WBTC -> WETH -> USDT\t ${testRates[step].WBTC_USDT_WETH.toString()}
        USDT -> WETH -> WBTC\t ${testRates[step].USDT_WBTC_WETH.toString()}
    `);
};

const checkPrices = (step1, step2) => {
    let fail = false;
    try { assertRoughlyEqualValues(testRates[step1].USDC_DAI_NONE.toString(), testRates[step2].USDC_DAI_NONE.toString(), 0.05); } catch (e) { console.log(e.message); fail = true; }
    try { assertRoughlyEqualValues(testRates[step1].DAI_USDC_NONE.toString(), testRates[step2].DAI_USDC_NONE.toString(), 0.05); } catch (e) { console.log(e.message); fail = true; }
    try { assertRoughlyEqualValues(testRates[step1].WBTC_USDT_NONE.toString(), testRates[step2].WBTC_USDT_NONE.toString(), 0.05); } catch (e) { console.log(e.message); fail = true; }
    try { assertRoughlyEqualValues(testRates[step1].USDT_WBTC_NONE.toString(), testRates[step2].USDT_WBTC_NONE.toString(), 0.05); } catch (e) { console.log(e.message); fail = true; }
    try { assertRoughlyEqualValues(testRates[step1].WBTC_USDT_WETH.toString(), testRates[step2].WBTC_USDT_WETH.toString(), 0.05); } catch (e) { console.log(e.message); fail = true; }
    try { assertRoughlyEqualValues(testRates[step1].USDT_WBTC_WETH.toString(), testRates[step2].USDT_WBTC_WETH.toString(), 0.05); } catch (e) { console.log(e.message); fail = true; }
    if (fail) {
        console.log('WARNING!!! Prices changed a lot after adding VelodromeFinance oracle');
    } else {
        console.log('OK!!! Prices have not changed a lot after adding VelodromeFinance oracle');
    }
};

module.exports = async ({ getNamedAccounts, deployments }) => {
    console.log('running optimism script to change screamWrapper');
    const chainId = await getChainId();
    console.log('network id ', chainId);
    if (chainId !== '10') {
        console.log('skipping wrong chain id deployment');
        return;
    }

    const { deployer } = await getNamedAccounts();

    const offchainOracle = await getContract('OffchainOracle', deployments);
    console.log('offchainOracle address: ', offchainOracle.address);

    // Get prices without VelodromeFinance
    await getPrices(offchainOracle, 'without VelodromeFinance oracle');

    // Deploy and add Velodrome-Finance oracle
    const velodromeFinance = await idempotentDeploy('SolidlyOracle', [ORACLES.VelodromeFinance.factory, ORACLES.VelodromeFinance.initHash], deployments, deployer, 'VelodromeFinanceOracle');
    console.log('VelodromeFinanceOracle address: ', velodromeFinance.address);

    await offchainOracle.addOracle(velodromeFinance.address, (toBN('0')).toString());
    console.log('VelodromeFinanceOracle added to OffchainOracle');

    // Check new prices
    await getPrices(offchainOracle, 'with VelodromeFinance oracle');
    checkPrices('without VelodromeFinance oracle', 'with VelodromeFinance oracle');
};

module.exports.skip = async () => true;
