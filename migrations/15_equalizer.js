// const OffchainOracle = artifacts.require('./OffchainOracle.sol');
// const UniswapV2LikeOracle = artifacts.require('./UniswapV2LikeOracle.sol');

// const offchainOracleAddr = '0x080AB73787A8B13EC7F40bd7d00d6CC07F9b24d0';

// const equalizerFactory = '0xF14421F0BCf9401d8930872C2d44d8e67e40529a';
// const equalizerCodeHash = '0x1c879dcd3af04306445addd2c308bd4d26010c7ca84c959c3564d4f6957ab20c';

// module.exports = function (deployer, network) {
//     return deployer.then(async () => {
//         if (network === 'test' || network === 'coverage') {
//             // migrations are not required for testing
//             return;
//         }

//         const account = '0x11799622F4D98A24514011E8527B969f7488eF47';
//         console.log('Deployer account: ' + account);
//         console.log('Deployer balance: ' + (await web3.eth.getBalance(account)) / 1e18 + ' ETH');

//         const equalizerOracle = await deployer.deploy(UniswapV2LikeOracle, equalizerFactory, equalizerCodeHash);
//         const offchainOracle = await OffchainOracle.at(offchainOracleAddr);
//         await offchainOracle.addOracle(equalizerOracle.address);
//     });
// };

module.exports = function (deployer, network) {
};
