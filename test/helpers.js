const { expect } = require('@1inch/solidity-utils');

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
    UNI: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
    AAVE: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',
    LRC: '0xBBbbCA6A901c926F240b89EacB641d8Aec7AEafD',
    COMP: '0xc00e94Cb662C3520282E6f5717214004A7f26888',
    sBTC: '0xfE18be6b3Bd88A2D2A7f928d00292E7a9963CfC6',
    sLINK: '0xbBC455cb4F1B9e4bFC4B73970d360c8f032EfEE6',
    sKRW: '0x269895a3dF4D73b077Fc823dD6dA1B95f72Aaf9B',
    sUSD: '0x57Ab1ec28D129707052df4dF418D58a2D46d5f51',
    SNX: '0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F',
    XRA: '0x7025bab2ec90410de37f488d1298204cd4d6b29d',
};

function assertRoughlyEquals (x, y, significantDigits) {
    const xBN = BigInt(x);
    const yBN = BigInt(y);
    let valid;
    if (xBN > yBN) {
        valid = (xBN - yBN) * (10n ** BigInt(significantDigits - 1)) < yBN;
    } else {
        valid = (yBN - xBN) * (10n ** BigInt(significantDigits - 1)) < xBN;
    }
    if (!valid) {
        expect(x).to.equal(y, `${x} != ${y} with at least ${significantDigits} significant digits`);
    }
}

module.exports = {
    tokens,
    assertRoughlyEquals,
};
