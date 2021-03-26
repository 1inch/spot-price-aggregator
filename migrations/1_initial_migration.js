// const { tokens } = require('../test/helpers.js');

// const OffchainOracle = artifacts.require('./OffchainOracle.sol');
// const MooniswapOracle = artifacts.require('./MooniswapOracle.sol');
// const UniswapOracle = artifacts.require('./UniswapOracle.sol');
// const UniswapV2LikeOracle = artifacts.require('./UniswapV2LikeOracle.sol');
// const IdentityWrapper = artifacts.require('./IdentityWrapper.sol');
// const WethWrapper = artifacts.require('./WethWrapper.sol');

// const contracts = {
//     mooniswapFactory: '0x71CD6666064C3A1354a3B4dca5fA1E2D3ee7D303',
//     oneInchLPFactory: '0xC4A8B7e29E3C8ec560cd4945c1cF3461a85a148d',
//     oneInchLP1Factory: '0xbAF9A5d4b0052359326A6CDAb54BABAa3a3A9643',
//     uniswapV2Factory: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
//     sushiswapFactory: '0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac',
// };

// const uniswapV2CodeHash = '0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f';
// const sushiswapCodeHash = '0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303';

// module.exports = function (deployer, network) {
//     return deployer.then(async () => {
//         if (network === 'test' || network === 'coverage') {
//             // migrations are not required for testing
//             return;
//         }

//         const account = '0x11799622F4D98A24514011E8527B969f7488eF47';
//         console.log('Deployer account: ' + account);
//         console.log('Deployer balance: ' + (await web3.eth.getBalance(account)) / 1e18 + ' ETH');

//         const mooniswapOracle = await deployer.deploy(MooniswapOracle, contracts.mooniswapFactory);
//         const oneInchLPOracle = await deployer.deploy(MooniswapOracle, contracts.oneInchLPFactory);
//         const oneInchLP1Oracle = await deployer.deploy(MooniswapOracle, contracts.oneInchLP1Factory);
//         const uniswapV2Oracle = await deployer.deploy(UniswapV2LikeOracle, contracts.uniswapV2Factory, uniswapV2CodeHash);
//         const sushiswapOracle = await deployer.deploy(UniswapV2LikeOracle, contracts.sushiswapFactory, sushiswapCodeHash);
//         const uniswapOracle = await deployer.deploy(UniswapOracle);

//         const identityWrapper = await deployer.deploy(IdentityWrapper);
//         const wethWrapper = await deployer.deploy(WethWrapper);

//         const offchainOracle = await deployer.deploy(OffchainOracle);

//         await Promise.all([
//             offchainOracle.addOracle(mooniswapOracle.address),
//             offchainOracle.addOracle(oneInchLPOracle.address),
//             offchainOracle.addOracle(oneInchLP1Oracle.address),
//             offchainOracle.addOracle(uniswapV2Oracle.address),
//             offchainOracle.addOracle(sushiswapOracle.address),
//             offchainOracle.addOracle(uniswapOracle.address),
//             offchainOracle.addWrapper(identityWrapper.address),
//             offchainOracle.addWrapper(wethWrapper.address),
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
