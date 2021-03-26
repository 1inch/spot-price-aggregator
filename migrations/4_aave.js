// const OffchainOracle = artifacts.require('./OffchainOracle.sol');
// const AaveWrapper = artifacts.require('./AaveWrapper.sol');

// const offchainOracleAddr = '0x6D68d90de84066E1F663b2E93726c10Da1b831F1';
// const markets = [
//     '0xdAC17F958D2ee523a2206206994597C13D831ec7',  // USDT
//     '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',  // WBTC
//     '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',  // WETH
//     '0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e',  // YFI
//     '0xE41d2489571d322189246DaFA5ebDe1F4699F498',  // ZRX
//     '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',  // UNI
//     '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',  // AAVE
//     '0x0D8775F648430679A709E98d2b0Cb6250d2887EF',  // BAT
//     '0x4Fabb145d64652a948d72533023f6E7A623C7C53',  // BUSD
//     '0x6B175474E89094C44Da98b954EedeAC495271d0F',  // DAI
//     '0xF629cBd94d3791C9250152BD8dfBDF380E2a3B9c',  // ENJ
//     '0xdd974D5C2e2928deA5F71b9825b8b646686BD200',  // KNC
//     '0x514910771AF9Ca656af840dff83E8264EcF986CA',  // LINK
//     '0x0F5D2fB29fb7d3CFeE444a200298f468908cC942',  // MANA
//     '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2',  // MKR
//     '0x408e41876cCCDC0F92210600ef50372656052a38',  // REN
//     '0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F',  // SNX
//     '0x57Ab1ec28D129707052df4dF418D58a2D46d5f51',  // SUSD
//     '0x0000000000085d4780B73119b644AE5ecd22b376',  // TUSD
//     '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',  // USDC
//     '0xD533a949740bb3306d119CC777fa900bA034cd52',  // CRV
//     '0x056Fd409E1d7A124BD7017459dFEa2F387b6d5Cd',  // GUSD
//     '0xba100000625a3754423978a60c9317c58a424e3D',  // BAL
// ];

// module.exports = function (deployer, network) {
//     return deployer.then(async () => {
//         if (network === 'test' || network === 'coverage') {
//             // migrations are not required for testing
//             return;
//         }

//         const account = '0x11799622F4D98A24514011E8527B969f7488eF47';
//         console.log('Deployer account: ' + account);
//         console.log('Deployer balance: ' + (await web3.eth.getBalance(account)) / 1e18 + ' ETH');

//         const offchainOracle = await OffchainOracle.at(offchainOracleAddr);
//         const aaveWrapper = await deployer.deploy(AaveWrapper)

//         await Promise.all([
//             offchainOracle.addWrapper(aaveWrapper.address),
//             aaveWrapper.addMarkets(markets),
//         ]);
//     });
// };

module.exports = function (deployer, network) {
};
