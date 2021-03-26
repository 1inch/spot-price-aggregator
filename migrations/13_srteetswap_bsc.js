// const OffchainOracle = artifacts.require('./OffchainOracle.sol');
// const UniswapV2LikeOracle = artifacts.require('./UniswapV2LikeOracle.sol');

// const offchainOracleAddr = '0xe26A18b00E4827eD86bc136B2c1e95D5ae115edD';

// const streetswapFactory = '0xaC653cE27E04C6ac565FD87F18128aD33ca03Ba2';
// const streetswapCodeHash = '0x0b3961eeccfbf746d2d5c59ee3c8ae3a5dcf8dc9b0dfb6f89e1e8ca0b32b544b';

// module.exports = function (deployer, network) {
//     return deployer.then(async () => {
//         if (network === 'test' || network === 'coverage') {
//             // migrations are not required for testing
//             return;
//         }

//         const account = '0x11799622F4D98A24514011E8527B969f7488eF47';
//         console.log('Deployer account: ' + account);
//         console.log('Deployer balance: ' + (await web3.eth.getBalance(account)) / 1e18 + ' ETH');

//         const streetswapOracle = await deployer.deploy(UniswapV2LikeOracle, streetswapFactory, streetswapCodeHash);
//         const offchainOracle = await OffchainOracle.at(offchainOracleAddr);
//         await offchainOracle.addOracle(streetswapOracle.address);
//     });
// };

module.exports = function (deployer, network) {
};
