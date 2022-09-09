const { getChainId } = require('hardhat');
const {
    idempotentDeploy,
    getContract,
} = require('./utils.js');
const { toBN } = require('@1inch/solidity-utils');
const { assertRoughlyEqualValues } = require('../test/helpers.js');

const ORACLES = {
    Printyfinance: {
        factory: '0xc62Ca231Cd2b0c530C622269dA02374134511a36',
        initHash: '0x96262ba85d1e33f4c9f8368149e7211436bc78c7058d43e303e73ffdfb9c0d8e',
    },
};

const NETWORK_TOKENS = {
    NONE: '0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF',
    DAI: '0xd586E7F844cEa2F87f50152665BCbc2C279D8d70',//eth bridged
    BTC: '0x152b9d0FdC40C096757F570A51E494bd4b943E50',//native bridge
    USDT: '0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7',//native
    USDC: '0x04068da6c83afcfa0e13ba15a6696662335d5b75',//native
};

const testRates = {};

const getPrices = async (offchainOracle, step = 0) => {
    testRates[step] = testRates[step] || {};
    testRates[step].USDC_DAI_NONE = await offchainOracle.getRate(NETWORK_TOKENS.USDC, NETWORK_TOKENS.DAI, NETWORK_TOKENS.NONE);
    testRates[step].DAI_USDC_NONE = await offchainOracle.getRate(NETWORK_TOKENS.DAI, NETWORK_TOKENS.USDC, NETWORK_TOKENS.NONE);
    testRates[step].BTC_USDT_NONE = await offchainOracle.getRate(NETWORK_TOKENS.BTC.b, NETWORK_TOKENS.USDT, NETWORK_TOKENS.NONE); // eslint-disable-line camelcase
    testRates[step].USDT_BTC_NONE = await offchainOracle.getRate(NETWORK_TOKENS.USDT, NETWORK_TOKENS.BTC, NETWORK_TOKENS.NONE); // eslint-disable-line camelcase
    testRates[step].BTC_USDT_WAVAX = await offchainOracle.getRate(NETWORK_TOKENS.BTC, NETWORK_TOKENS.USDT, NETWORK_TOKENS.WAVAX); // eslint-disable-line camelcase
    testRates[step].USDT_BTC_WAVAX = await offchainOracle.getRate(NETWORK_TOKENS.USDT, NETWORK_TOKENS.BTC, NETWORK_TOKENS.WAVAX); // eslint-disable-line camelcase
    console.log(`Prices with step '${step}':`);
    console.log(`
        USDC -> DAI\t\t ${testRates[step].USDC_DAI_NONE.toString()}
        DAI -> USDC\t\t ${testRates[step].DAI_USDC_NONE.toString()}
        BTC -> USDT\t\t ${testRates[step].BTC_USDT_NONE.toString()}
        fUSDT -> BTC\t\t ${testRates[step].fUSDT_BTC_NONE.toString()}
        BTC -> WAVAX -> USDT\t ${testRates[step].BTC_USDT_WAVAX.toString()}
        USDT -> WAVAX -> BTC\t ${testRates[step].USDT_BTC_WAVAX.toString()}
    `);
};

const checkPrices = (step1, step2) => {
    let fail = false;
    try { assertRoughlyEqualValues(testRates[step1].USDC_DAI_NONE.toString(), testRates[step2].USDC_DAI_NONE.toString(), 0.05); } catch (e) { console.log(e.message); fail = true; }
    try { assertRoughlyEqualValues(testRates[step1].DAI_USDC_NONE.toString(), testRates[step2].DAI_USDC_NONE.toString(), 0.05); } catch (e) { console.log(e.message); fail = true; }
    try { assertRoughlyEqualValues(testRates[step1].BTC_USDT_NONE.toString(), testRates[step2].BTC_USDT_NONE.toString(), 0.05); } catch (e) { console.log(e.message); fail = true; }
    try { assertRoughlyEqualValues(testRates[step1].USDT_BTC_NONE.toString(), testRates[step2].USDT_BTC_NONE.toString(), 0.05); } catch (e) { console.log(e.message); fail = true; }
    try { assertRoughlyEqualValues(testRates[step1].BTC_USDT_WAVAX.toString(), testRates[step2].BTC_USDT_WAVAX.toString(), 0.05); } catch (e) { console.log(e.message); fail = true; }
    try { assertRoughlyEqualValues(testRates[step1].USDT_BTC_WAVAX.toString(), testRates[step2].USDT_BTC_WAVAX.toString(), 0.05); } catch (e) { console.log(e.message); fail = true; }
    if (fail) {
        console.log('WARNING!!! Prices changed a lot after adding Printyfinance oracle');
    } else {
        console.log('OK!!! Prices have not changed a lot after adding Printyfinance oracle');
    }
};

module.exports = async ({ getNamedAccounts, deployments }) => {
    console.log('running fantom script to change screamWrapper');
    const chainId = await getChainId();
    console.log('network id ', chainId);
    if (chainId !== '43114') {
        console.log('skipping wrong chain id deployment');
        return;
    }

    const { deployer } = await getNamedAccounts();

    const offchainOracle = await getContract('OffchainOracle', deployments);
    console.log('offchainOracle address: ', offchainOracle.address);

    // Get prices without Printyfinance
    await getPrices(offchainOracle, 'without Printyfinance oracle');

    // Deploy and add printyfinance oracle
    const printyfinance = await idempotentDeploy('PrintyfinanceOracle', [ORACLES.Printyfinance.factory, ORACLES.Printyfinance.initHash], deployments, deployer, 'PrintyfinanceOracle');
    console.log('PrintyfinanceOracle address: ', printyfinance.address);

    await offchainOracle.addOracle(printyfinance.address, (toBN('0')).toString());
    console.log('PrintyfinanceOracle added to OffchainOracle');

    // Check new prices
    await getPrices(offchainOracle, 'with Printyfinance oracle');
    checkPrices('without Printyfinance oracle', 'with Printyfinance oracle');
};

module.exports.skip = async () => true;
