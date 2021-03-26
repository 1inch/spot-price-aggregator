// const { tokens } = require('../test/helpers.js');

// const OffchainOracle = artifacts.require('./OffchainOracle.sol');

// const oracles = {
//     mooniswapOracle: '0x1488a117641eD5D2D29AB3eD2397963FdEFEc25e',
//     oneInchLPOracle: '0x1Ad5eD95B8197fcC75e38fB0BC2C51dcc9B94097',
//     oneInchLP1Oracle: '0x30829F90270eb4270d8CAdFAfcF13f1DF841be1d',
//     uniswapV2Oracle: '0x8dc76c16e90351C1574a3Eea5c5797C475eA7292',
//     sushiswapOracle: '0x4749B35AE40897B40585633261c5f743730fE8BC',
//     uniswapOracle: '0x05AD60d9a2f1aa30BA0cdbAF1E0A0A145fBeA16F',
// };

// const wrappers = {
//     identityWrapper: '0x78fF2e079F3cB3f903eEf225da8edf88E1c51045',
//     wethWrapper: '0xCD9797E66c41F80B9D91B201d2F10E1bD7A268FD',
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

//         const offchainOracle = await deployer.deploy(OffchainOracle);

//         await Promise.all([
//             offchainOracle.addOracle(oracles.mooniswapOracle),
//             offchainOracle.addOracle(oracles.oneInchLPOracle),
//             offchainOracle.addOracle(oracles.oneInchLP1Oracle),
//             offchainOracle.addOracle(oracles.uniswapV2Oracle),
//             offchainOracle.addOracle(oracles.sushiswapOracle),
//             offchainOracle.addOracle(oracles.uniswapOracle),
//             offchainOracle.addWrapper(wrappers.identityWrapper),
//             offchainOracle.addWrapper(wrappers.wethWrapper),
//             offchainOracle.addConnector(tokens.ETH),
//             offchainOracle.addConnector(tokens.WETH),
//             offchainOracle.addConnector(tokens.USDC),
//             offchainOracle.addConnector(tokens.DAI),
//             offchainOracle.addConnector(tokens.NONE),
//         ]);
//     });
// };

module.exports = function (deployer, network) {
};
