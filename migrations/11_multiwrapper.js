// const { tokens } = require('../test/helpers.js');

// const OffchainOracle = artifacts.require('./OffchainOracle.sol');
// const MultiWrapper = artifacts.require('./MultiWrapper.sol');

// const oracles = {
//     mooniswapOracle: '0x1488a117641eD5D2D29AB3eD2397963FdEFEc25e',
//     oneInchLPOracle: '0x1Ad5eD95B8197fcC75e38fB0BC2C51dcc9B94097',
//     oneInchLP1Oracle: '0x30829F90270eb4270d8CAdFAfcF13f1DF841be1d',
//     uniswapV2Oracle: '0x8dc76c16e90351C1574a3Eea5c5797C475eA7292',
//     sushiswapOracle: '0x4749B35AE40897B40585633261c5f743730fE8BC',
//     uniswapOracle: '0x05AD60d9a2f1aa30BA0cdbAF1E0A0A145fBeA16F',
// };

// const wrappers = {
//     wethWrapper: '0xCD9797E66c41F80B9D91B201d2F10E1bD7A268FD',
//     compoundWrapper: '0x7C327E1Ee66d4cF7F4053387241351FDc95A0c04',
//     aaveWrapperV1: '0x8C00a411Fe8983525F82CFCe34fe4B092d9E525d',
//     aaveWrapperV2: '0x06cC74503B6d1eB6D4d6Bc402f48fC07b804105f',
//     fulcrumWrapper: '0xf971FF7838AE0c9316289f0e1aAB69218ea9073c',
//     fulcrumWrapperLegacy: '0x5335e083867FA58C70bC43b1498D80575FdeF60c',
// }

// module.exports = function (deployer, network) {
//     return deployer.then(async () => {
//         if (network === 'test' || network === 'coverage') {
//             // migrations are not required for testing
//             return;
//         }

//         const account = '0x11799622F4D98A24514011E8527B969f7488eF47';
//         console.log('Deployer account: ' + account);
//         console.log('Deployer balance: ' + (await web3.eth.getBalance(account)) / 1e18 + ' ETH');

//         const multiWrapper = await deployer.deploy(
//             MultiWrapper,
//             [
//                 wrappers.wethWrapper,
//                 wrappers.compoundWrapper,
//                 wrappers.aaveWrapperV1,
//                 wrappers.aaveWrapperV2,
//                 wrappers.fulcrumWrapper,
//                 wrappers.fulcrumWrapperLegacy,
//             ]
//         );

//         await deployer.deploy(
//             OffchainOracle,
//             multiWrapper.address,
//             [
//                 oracles.mooniswapOracle,
//                 oracles.oneInchLPOracle,
//                 oracles.oneInchLP1Oracle,
//                 oracles.uniswapV2Oracle,
//                 oracles.sushiswapOracle,
//                 oracles.uniswapOracle,
//             ],
//             [
//                 tokens.ETH,
//                 tokens.WETH,
//                 tokens.USDC,
//                 tokens.DAI,
//                 tokens.USDT,
//                 tokens.NONE,
//             ]
//         );
//     });
// };

module.exports = function (deployer, network) {
};
