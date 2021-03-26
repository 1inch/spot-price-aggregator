// const { tokens } = require('../test/helpers.js');

// const OffchainOracle = artifacts.require('./OffchainOracle.sol');

// const offchainOracleAddr = '0xe3c6B9C13739087c89Dcb83D3Ec15a767d829AA8';

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
//         await offchainOracle.addConnector(tokens.USDT);
//     });
// };

module.exports = function (deployer, network) {
};
