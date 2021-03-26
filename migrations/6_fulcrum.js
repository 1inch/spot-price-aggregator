// const OffchainOracle = artifacts.require('./OffchainOracle.sol');
// const FulcrumWrapperLegacy = artifacts.require('./FulcrumWrapperLegacy.sol');

// const offchainOracleAddr = '0xe3c6B9C13739087c89Dcb83D3Ec15a767d829AA8';
// const markets = [
//     '0x77f973FCaF871459aa58cd81881Ce453759281bC',  // iETH
//     '0x14094949152EDDBFcd073717200DA82fEd8dC960',  // iSAI
//     '0x493C57C4763932315A328269E1ADaD09653B9081',  // iDAI
//     '0xF013406A0B1d544238083DF0B93ad0d2cBE0f65f',  // iUSDC
//     '0x8326645f3Aa6De6420102Fdb7Da9E3a91855045B',  // iUSDT
//     '0x49f4592E641820e928F9919Ef4aBd92a719B4b49',  // iSUSD
//     '0xBA9262578EFef8b3aFf7F60Cd629d6CC8859C8b5',  // iWBTC
//     '0x1D496da96caf6b518b133736beca85D5C4F9cBc5',  // iLINK
//     '0xA7Eb2bc82df18013ecC2A6C533fc29446442EDEe',  // iZRX
//     '0xBd56E9477Fc6997609Cf45F84795eFbDAC642Ff1',  // iREP
//     '0x1cC9567EA2eB740824a45F8026cCF8e46973234D',  // iKNC
//     '0xA8b65249DE7f85494BC1fe75F525f568aa7dfa39',  // iBAT
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

//         const offchainOracle = await OffchainOracle.at(offchainOracleAddr);
//         const fulcrumWrapperLegacy = await deployer.deploy(FulcrumWrapperLegacy)

//         await Promise.all([
//             offchainOracle.addWrapper(fulcrumWrapperLegacy.address),
//             fulcrumWrapperLegacy.addMarkets(markets),
//         ]);
//     });
// };

module.exports = function (deployer, network) {
};
