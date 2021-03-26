// const { tokens } = require('../test/helpers.js');

// const OffchainOracle = artifacts.require('./OffchainOracle.sol');
// const UniswapV2LikeOracle = artifacts.require('./UniswapV2LikeOracle.sol');
// const BaseCoinWrapper = artifacts.require('./BaseCoinWrapper.sol');
// const CompoundLikeWrapper = artifacts.require('./CompoundLikeWrapper.sol');
// const MultiWrapper = artifacts.require('./MultiWrapper.sol');

// const contracts = {
//     pancakeswapFactory: '0xbcfccbde45ce874adcb698cc183debcf17952812',
//     demaxswapFactory: '0x8a1e9d3aebbbd5ba2a64d3355a48dd5e9b511256',
//     venusComptroller: '0xfD36E2c2a6789Db23113685031d7F16329158384',
// };

// const pancakeswapCodeHash = '0xd0d4c4cd0848c93cb4fd1f498d7013ee6bfb25783ea21593d5834f5d250ece66';
// const demaxswapCodeHash = '0x9e2f28ebeccb25f4ead99c3f563bb6a201e2014a501d90dd0a9382bb1f5f4d0e';

// const WBNB = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c';
// const binDAI = '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3';
// const binETH = '0x2170Ed0880ac9A755fd29B2688956BD959F933F8';
// const binUSDC = '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d';
// const binUSDT = '0x55d398326f99059fF775485246999027B3197955';
// const vBNB = '0xA07c5b74C9B40447a954e1466938b865b6BBea36';

// const markets = [
//     '0xecA88125a5ADbe82614ffC12D0DB554E2e2867C8',  // vUSDC
//     '0xfD5840Cd36d94D7229439859C0112a4185BC0255',  // vUSDT
//     '0x95c78222B3D6e262426483D42CfA53685A67Ab9D',  // vBUSD
//     '0x2fF3d0F6990a40261c66E1ff2017aCBc282EB6d0',  // vSXP
//     '0x151B1e2635A717bcDc836ECd6FbB62B674FE3E1D',  // vXVS
//     '0x882C173bC7Ff3b7786CA16dfeD3DFFfb9Ee7847B',  // vBTC
//     '0xf508fCD89b8bd15579dc79A6827cB4686A3592c8',  // vETH
//     '0x57A5297F2cB2c0AaC9D554660acd6D385Ab50c6B',  // vLTC
//     '0xB248a295732e0225acd3337607cc01068e3b9c10',  // vXRP
//     '0x5F0388EBc2B94FA8E123F404b79cCF5f40b29176',  // vBCH
//     '0x1610bc33319e9398de5f57B33a5b184c806aD217',  // vDOT
//     '0x650b940a1033B8A1b1873f78730FcFC73ec11f1f',  // vLINK
//     '0x334b3eCB4DCa3593BCCC3c7EBD1A1C1d1780FBF1',  // vDAI
//     '0xf91d58b5aE142DAcC749f58A49FCBac340Cb0343',  // vFIL
//     '0x972207A639CC1B374B893cc33Fa251b55CEB7c07',  // vBETH
//     '0xeBD0070237a0713E8D94fEf1B728d3d993d290ef',  // vCAN
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

//         const pancakeswapOracle = await deployer.deploy(UniswapV2LikeOracle, contracts.pancakeswapFactory, pancakeswapCodeHash);
//         const demaxswapOracle = await deployer.deploy(UniswapV2LikeOracle, contracts.demaxswapFactory, demaxswapCodeHash);
//         const wbnbWrapper = await deployer.deploy(BaseCoinWrapper, WBNB);
//         const compoundLikeWrapper = await deployer.deploy(CompoundLikeWrapper, contracts.venusComptroller, vBNB);

//         const multiWrapper = await deployer.deploy(
//             MultiWrapper,
//             [
//                 wbnbWrapper.address,
//                 compoundLikeWrapper.address
//             ]
//         );

//         await Promise.all([
//             compoundLikeWrapper.addMarkets(markets),
//             deployer.deploy(
//                 OffchainOracle,
//                 multiWrapper.address,
//                 [
//                     pancakeswapOracle.address,
//                     demaxswapOracle.address,
//                 ],
//                 [
//                     tokens.ETH,  // BNB
//                     WBNB,
//                     binDAI,
//                     binETH,
//                     binUSDC,
//                     binUSDT,
//                     tokens.NONE,
//                 ]
//             ),
//         ]);
//     });
// };

module.exports = function (deployer, network) {
};
