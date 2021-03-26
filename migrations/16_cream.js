// const MultiWrapper = artifacts.require('./MultiWrapper.sol');
// const CompoundLikeWrapper = artifacts.require('./CompoundLikeWrapper.sol');

// const creamComptroller = '0x3d5BC3c8d13dcB8bF317092d84783c2697AE9258';
// const crETH = '0xd06527d5e56a3495252a528c4987003b712860ee';
// const multiwrapperAddr = '0x931e32B6D112F7BE74B16f7FBc77D491B30fe18c';
// const markets = [
//     '0x011a014d5e8eb4771e575bb1000318d509230afa',  // crUNI-V2-WBTC-ETH
//     '0x01da76dea59703578040012357b81ffe62015c2d',  // crYETH
//     '0x054b7ed3f45714d3091e82aad64a1588dc4096ed',  // crHBTC
//     '0x10a3da2bb0fae4d591476fd97d6636fd172923a8',  // crHEGIC
//     '0x10fdbd1e48ee2fd9336a482d746138ae19e649db',  // crFTT
//     '0x17107f40d70f4470d20cb3f138a052cae8ebd4be',  // crRENBTC
//     '0x197070723ce0d3810a0e47f06e935c30a480d4fc',  // crWBTC
//     '0x19d1666f543d42ef17f66e376944a22aea1a8e46',  // crCOMP
//     '0x1d0986fb43985c88ffa9ad959cc24e6a087c7e35',  // crALPHA
//     '0x1ff8cdb51219a8838b52e9cac09b71e591bc998e',  // crBUSD
//     '0x21011bc93d9e515b9511a817a1ed1d6d468f49fc',  // crCOVER
//     '0x228619cca194fbe3ebeb2f835ec1ea5080dafbb2',  // crXSUSHI
//     '0x22b243b96495c547598d9042b6f94b01c22b2e9e',  // crSWAG
//     '0x25555933a8246ab67cbf907ce3d1949884e82b55',  // crSUSD
//     '0x2a537fa9ffaea8c1a41d3c2b68a9cb791529366d',  // crDPI
//     '0x2db6c82ce72c8d7d770ba1b5f5ed0b6e075066d6',  // crAMP
//     '0x3225e3c669b39c7c8b3e204a8614bb218c5e31bc',  // crAAVE
//     '0x338286c0bc081891a4bda39c7667ae150bf5d206',  // crSUSHI
//     '0x3623387773010d9214b10c551d6e7fc375d31f58',  // crMTA
//     '0x38f27c03d6609a86ff7716ad03038881320be4ad',  // crSLP-DAI-ETH
//     '0x3c6c553a95910f9fc81c98784736bd628636d296',  // crESD
//     '0x44fbebd2f576670a6c33f6fc0b00aa8c5753b322',  // crUSDC
//     '0x460ea730d204c822ce709f00a8e5959921715adc',  // crBAC
//     '0x4ee15f44c6f0d8d1136c83efd2e8e4ac768954c6',  // crYYCRV
//     '0x4fe11bc316b6d7a345493127fbe298b95adaad85',  // crUNI-V2-USDC-ETH
//     '0x59089279987dd76fc65bf94cb40e186b96e03cb3',  // crOGN
//     '0x5c291bc83d15f71fb37805878161718ea4b6aee9',  // crSLP-ETH-USDT
//     '0x5ecad8a75216cea7dff978525b2d523a251eea92',  // crSLP-USDC-ETH
//     '0x65883978ada0e707c3b2be2a6825b1c4bdf76a90',  // crAKRO
//     '0x697256caa3ccafd62bb6d3aa1c7c5671786a5fd9',  // crLINK
//     '0x6ba0c66c48641e220cf78177c144323b3838d375',  // crSLP-SUSHI-ETH
//     '0x73f6cba38922960b7092175c0add22ab8d0e81fc',  // crSLP-WBTC-ETH
//     '0x797aab1ce7c01eb727ab980762ba88e7133d2157',  // crUSDT
//     '0x7aaa323d7e398be4128c7042d197a2545f0f1fea',  // crOMG
//     '0x7ea9c63e216d5565c3940a2b3d150e59c2907db3',  // crBBTC
//     '0x85759961b116f1d36fd697855c57a6ae40793d9b',  // cr1INCH
//     '0x892b14321a4fcba80669ae30bd0cd99a7ecf6ac0',  // crCREAM
//     '0x8b3ff1ed4f36c2c2be675afb13cc3aa5d73685a5',  // crCEL
//     '0x8b86e0598616a8d4f1fdae8b59e55fb5bc33d0d6',  // crLEND
//     '0x8b950f43fcac4931d408f1fcda55c6cb6cbf3096',  // crBBADGER
//     '0x903560b1cce601794c584f58898da8a8b789fc5d',  // crKP3R
//     '0x92b767185fb3b04f881e3ac8e5b0662a027a1d9f',  // crDAI
//     '0x9baf8a5236d44ac410c0186fe39178d5aad0bb87',  // crYCRV
//     '0xb092b4601850e23903a42eacbc9d8a0eec26a4d5',  // crFRAX
//     '0xc25eae724f189ba9030b2556a1533e7c8a732e14',  // crSNX
//     '0xc68251421edda00a10815e273fa4b1191fac651b',  // crPICKLE
//     '0xc7fd8dcee4697ceef5a2fd4608a7bd6a94c77480',  // crCRV
//     '0xcbae0a83f4f9926997c8339545fb8ee32edc6b76',  // crYFI
//     '0xcd22c4110c12ac41acefa0091c432ef44efaafa0',  // crUNI-V2-DAI-ETH
//     '0xce4fe9b4b8ff61949dcfeb7e03bc9faca59d2eb3',  // crBAL
//     '0xd5103afcd0b3fa865997ef2984c66742c51b2a8b',  // crHFIL
//     '0xd532944df6dfd5dd629e8772f03d4fc861873abf',  // crSLP-YFI-ETH
//     '0xd692ac3245bb82319a31068d6b8412796ee85d2c',  // crHUSD
//     '0xe6c3120f38f56deb38b69b65cc7dcaf916373963',  // crUNI-V2-ETH-USDT
//     '0xe89a6d0509faf730bd707bf868d9a2a744a363c7',  // crUNI
//     '0xef58b2d5a1b8d3cde67b8ab054dc5c831e9bc025',  // crSRM
//     '0xeff039c3c1d668f408d09dd7b63008622a77532c',  // crWNXM
//     '0xf047d4be569fb770db143a6a90ef203fc1295922',  // crTBTC
//     '0xf55bbe0255f7f4e70f63837ff72a577fbddbe924',  // crBOND
//     '0xfd609a03b393f1a1cfcacedabf068cad09a924e2',  // crCRETH2
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

//         const multiWrapper = await MultiWrapper.at(multiwrapperAddr);
//         const creamWrapper = await deployer.deploy(CompoundLikeWrapper, creamComptroller, crETH)

//         await Promise.all([
//             multiWrapper.addWrapper(creamWrapper.address),
//             creamWrapper.addMarkets(markets),
//         ]);
//     });
// };

module.exports = function (deployer, network) {
};
