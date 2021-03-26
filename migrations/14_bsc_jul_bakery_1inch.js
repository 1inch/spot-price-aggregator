// const OffchainOracle = artifacts.require('./OffchainOracle.sol');
// const UniswapV2LikeOracle = artifacts.require('./UniswapV2LikeOracle.sol');
// const MooniswapOracle = artifacts.require('./MooniswapOracle.sol');

// const offchainOracleAddr = '0xe26A18b00E4827eD86bc136B2c1e95D5ae115edD';

// const bakeryswapFactory = '0x01bf7c66c6bd861915cdaae475042d3c4bae16a7';
// const bakeryswapCodeHash = '0xe2e87433120e32c4738a7d8f3271f3d872cbe16241d67537139158d90bac61d3';
// const julswapFactory = '0x553990f2cba90272390f62c5bdb1681ffc899675';
// const julswapCodeHash = '0xb1e98e21a5335633815a8cfb3b580071c2e4561c50afd57a8746def9ed890b18';
// const oneInchLpFactory = '0xd41b24bba51fac0e4827b6f94c0d6ddeb183cd64';

// module.exports = function (deployer, network) {
//     return deployer.then(async () => {
//         if (network === 'test' || network === 'coverage') {
//             // migrations are not required for testing
//             return;
//         }

//         const account = '0x11799622F4D98A24514011E8527B969f7488eF47';
//         console.log('Deployer account: ' + account);
//         console.log('Deployer balance: ' + (await web3.eth.getBalance(account)) / 1e18 + ' ETH');

//         const bakeryswapOracle = await deployer.deploy(UniswapV2LikeOracle, bakeryswapFactory, bakeryswapCodeHash);
//         const julswapOracle = await deployer.deploy(UniswapV2LikeOracle, julswapFactory, julswapCodeHash);
//         const oneInchLpOracle = await deployer.deploy(MooniswapOracle, oneInchLpFactory);

//         const offchainOracle = await OffchainOracle.at(offchainOracleAddr);
//         await Promise.all([
//             offchainOracle.addOracle(bakeryswapOracle.address),
//             offchainOracle.addOracle(julswapOracle.address),
//             offchainOracle.addOracle(oneInchLpOracle.address),
//         ]);
//     });
// };

module.exports = function (deployer, network) {
};
