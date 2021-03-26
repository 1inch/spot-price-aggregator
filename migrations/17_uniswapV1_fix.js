// const OffchainOracle = artifacts.require('./OffchainOracle.sol');
// const UniswapOracle = artifacts.require('./UniswapOracle.sol');
// const offchainOracleAddr = '0x080AB73787A8B13EC7F40bd7d00d6CC07F9b24d0';
// const oldUniV1OracleAddr = '0x05AD60d9a2f1aa30BA0cdbAF1E0A0A145fBeA16F';

// module.exports = function (deployer, network) {
//     return deployer.then(async () => {
//         if (network === 'test' || network === 'coverage') {
//             // migrations are not required for testing
//             return;
//         }

//         const account = '0x11799622F4D98A24514011E8527B969f7488eF47';
//         console.log('Deployer account: ' + account);
//         console.log('Deployer balance: ' + (await web3.eth.getBalance(account)) / 1e18 + ' ETH');

//         const uniswapOracle = await deployer.deploy(UniswapOracle);

//         const offchainOracle = await OffchainOracle.at(offchainOracleAddr);

//         await Promise.all([
//             offchainOracle.addOracle(uniswapOracle.address),
//             offchainOracle.removeOracle(oldUniV1OracleAddr),
//         ]);
//     });
// };

module.exports = function (deployer, network) {
};
