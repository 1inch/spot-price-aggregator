const { BN } = require('@openzeppelin/test-helpers/src/setup');

const tokens = {
    DAI: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    NONE: '0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF',
    ETH: '0x0000000000000000000000000000000000000000',
    EEE: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    WBTC: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    '1INCH': '0x111111111117dC0aa78b770fA6A738034120C302',
    USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    LINK: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
    YFI: '0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e',
    BZRX: '0x56d811088235F11C8920698a204A5010a788f4b3',
    MKR: '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2',
    KNC: '0xdd974D5C2e2928deA5F71b9825b8b646686BD200',
    UNI: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
    AAVE: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',
    LRC: '0xBBbbCA6A901c926F240b89EacB641d8Aec7AEafD',
    COMP: '0xc00e94Cb662C3520282E6f5717214004A7f26888',
    sREN: '0x4287dac1cC7434991119Eba7413189A66fFE65cF',
    iDOT: '0xF6ce55E09De0F9F97210aAf6DB88Ed6b6792Ca1f',
};

function assertRoughlyEquals (x, y, significantDigits) {
    const xBN = new BN(x);
    const yBN = new BN(y);
    let valid;
    if (xBN.gt(yBN)) {
        valid = xBN.sub(yBN).mul((new BN('10')).pow(new BN(significantDigits.toString()))).lt(yBN);
    } else {
        valid = yBN.sub(xBN).mul((new BN('10')).pow(new BN(significantDigits.toString()))).lt(xBN);
    }
    if (!valid) {
        expect(x).to.be.bignumber.equal(y, `${x} != ${y} with at least ${significantDigits} significant digits`);
    }
}

function assertRoughlyEqualValues (expected, actual, relativeDiff) {
    const expectedBN = new BN(expected);
    const actualBN = new BN(actual);

    let multiplerNumerator = relativeDiff;
    let multiplerDenominator = new BN('1');
    while (!Number.isInteger(multiplerNumerator)) {
        multiplerDenominator = multiplerDenominator.mul(new BN('10'));
        multiplerNumerator *= 10;
    }
    const diff = expectedBN.sub(actualBN).abs();
    const treshold = expectedBN.mul(new BN(multiplerNumerator)).div(multiplerDenominator);
    if (!diff.lte(treshold)) {
        expect(actualBN).to.be.bignumber.equal(expectedBN, `${actualBN} != ${expectedBN} with ${relativeDiff} precision`);
    }
}

function getUniswapV3Fee (percents) {
    return new BN(percents * 10000);
}

module.exports = {
    tokens,
    assertRoughlyEquals,
    assertRoughlyEqualValues,
    getUniswapV3Fee,
};
