const { getChainId } = require('hardhat');
const { getContract } = require('../utils.js');
const { deployAndGetContract, toBN } = require('@1inch/solidity-utils');
const { assertRoughlyEqualValues } = require('../../test/helpers.js');

const ORACLES = {
    Solidly: {
        factory: '0x3faab499b519fdc5819e3d7ed0c26111904cbc28',
        initHash: '0x57ae84018c47ebdaf7ddb2d1216c8c36389d12481309af65428eb6d460f747a4',
    },
};

const NETWORK_TOKENS = {
    NONE: '0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF',
    DAI: '0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e',
    wFTM: '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83',
    BTC: '0x321162cd933e2be498cd2267a90534a804051b11',
    fUSDT: '0x049d68029688eabf473097a2fc38ef61633a3c7a',
    USDC: '0x04068da6c83afcfa0e13ba15a6696662335d5b75',
};

const testRates = {};

const getPrices = async (offchainOracle, step = 0) => {
    testRates[step] = testRates[step] || {};
    testRates[step].USDC_DAI_NONE = await offchainOracle.getRate(NETWORK_TOKENS.USDC, NETWORK_TOKENS.DAI, NETWORK_TOKENS.NONE);
    testRates[step].DAI_USDC_NONE = await offchainOracle.getRate(NETWORK_TOKENS.DAI, NETWORK_TOKENS.USDC, NETWORK_TOKENS.NONE);
    testRates[step].BTC_fUSDT_NONE = await offchainOracle.getRate(NETWORK_TOKENS.BTC, NETWORK_TOKENS.fUSDT, NETWORK_TOKENS.NONE); // eslint-disable-line camelcase
    testRates[step].fUSDT_BTC_NONE = await offchainOracle.getRate(NETWORK_TOKENS.fUSDT, NETWORK_TOKENS.BTC, NETWORK_TOKENS.NONE); // eslint-disable-line camelcase
    testRates[step].BTC_fUSDT_wFTM = await offchainOracle.getRate(NETWORK_TOKENS.BTC, NETWORK_TOKENS.fUSDT, NETWORK_TOKENS.wFTM); // eslint-disable-line camelcase
    testRates[step].fUSDT_BTC_wFTM = await offchainOracle.getRate(NETWORK_TOKENS.fUSDT, NETWORK_TOKENS.BTC, NETWORK_TOKENS.wFTM); // eslint-disable-line camelcase
    console.log(`Prices with step '${step}':`);
    console.log(`
        USDC -> DAI\t\t ${testRates[step].USDC_DAI_NONE.toString()}
        DAI -> USDC\t\t ${testRates[step].DAI_USDC_NONE.toString()}
        BTC -> fUSDT\t\t ${testRates[step].BTC_fUSDT_NONE.toString()}
        fUSDT -> BTC\t\t ${testRates[step].fUSDT_BTC_NONE.toString()}
        BTC -> wFTM -> fUSDT\t ${testRates[step].BTC_fUSDT_wFTM.toString()}
        fUSDT -> wFTM -> BTC\t ${testRates[step].fUSDT_BTC_wFTM.toString()}
    `);
};

const checkPrices = (step1, step2) => {
    let fail = false;
    try { assertRoughlyEqualValues(testRates[step1].USDC_DAI_NONE.toString(), testRates[step2].USDC_DAI_NONE.toString(), 0.05); } catch (e) { console.log(e.message); fail = true; }
    try { assertRoughlyEqualValues(testRates[step1].DAI_USDC_NONE.toString(), testRates[step2].DAI_USDC_NONE.toString(), 0.05); } catch (e) { console.log(e.message); fail = true; }
    try { assertRoughlyEqualValues(testRates[step1].BTC_fUSDT_NONE.toString(), testRates[step2].BTC_fUSDT_NONE.toString(), 0.05); } catch (e) { console.log(e.message); fail = true; }
    try { assertRoughlyEqualValues(testRates[step1].fUSDT_BTC_NONE.toString(), testRates[step2].fUSDT_BTC_NONE.toString(), 0.05); } catch (e) { console.log(e.message); fail = true; }
    try { assertRoughlyEqualValues(testRates[step1].BTC_fUSDT_wFTM.toString(), testRates[step2].BTC_fUSDT_wFTM.toString(), 0.05); } catch (e) { console.log(e.message); fail = true; }
    try { assertRoughlyEqualValues(testRates[step1].fUSDT_BTC_wFTM.toString(), testRates[step2].fUSDT_BTC_wFTM.toString(), 0.05); } catch (e) { console.log(e.message); fail = true; }
    if (fail) {
        console.log('WARNING!!! Prices changed a lot after adding Solidly oracle');
    } else {
        console.log('OK!!! Prices have not changed a lot after adding Solidly oracle');
    }
};

module.exports = async ({ getNamedAccounts, deployments }) => {
    console.log('running fantom script to change screamWrapper');
    const chainId = await getChainId();
    console.log('network id ', chainId);
    if (chainId !== '250') {
        console.log('skipping wrong chain id deployment');
        return;
    }

    const { deployer } = await getNamedAccounts();

    const offchainOracle = await getContract('OffchainOracle', deployments);
    console.log('offchainOracle address: ', offchainOracle.address);

    // Get prices without Solidly
    await getPrices(offchainOracle, 'without Solidly oracle');

    // Deploy and add solidly oracle
    const solidly = await deployAndGetContract({
        contractName: 'SolidlyOracle',
        constructorArgs: [ORACLES.Solidly.factory, ORACLES.Solidly.initHash],
        deployments,
        deployer,
        deploymentName: 'SolidlyOracle',
    });
    console.log('SolidlyOracle address: ', solidly.address);

    await offchainOracle.addOracle(solidly.address, (toBN('0')).toString());
    console.log('SolidlyOracle added to OffchainOracle');

    // Check new prices
    await getPrices(offchainOracle, 'with Solidly oracle');
    checkPrices('without Solidly oracle', 'with Solidly oracle');
};

module.exports.skip = async () => true;
