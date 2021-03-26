// const OffchainOracle = artifacts.require('./OffchainOracle.sol');
// const CompoundWrapper = artifacts.require('./CompoundWrapper.sol');

// const offchainOracleAddr = '0x6D68d90de84066E1F663b2E93726c10Da1b831F1';
// const markets = [
//     '0x6C8c6b02E7b2BE14d4fA6022Dfd6d75921D90E4E',  // cBAT
//     '0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643',  // cDAI
//     '0x158079ee67fce2f58472a96584a73c7ab9ac95c1',  // cREP
//     '0x39AA39c021dfbaE8faC545936693aC917d5E7563',  // cUSDC
//     '0xf650C3d88D12dB855b8bf7D11Be6C55A4e07dCC9',  // cUSDT
//     '0xC11b1268C1A384e55C48c2391d8d480264A3A7F4',  // cWBTC
//     '0xB3319f5D18Bc0D84dD1b4825Dcde5d5f7266d407',  // cZRX
//     '0xF5DCe57282A584D2746FaF1593d3121Fcac444dC',  // cSAI
//     '0x35A18000230DA775CAc24873d00Ff85BccdeD550',  // cUNI
//     '0x70e36f6BF80a52b3B46b3aF8e106CC0ed743E8e4',  // cCOMP
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
//         const compoundWrapper = await deployer.deploy(CompoundWrapper)

//         await Promise.all([
//             offchainOracle.addWrapper(compoundWrapper.address),
//             compoundWrapper.addMarkets(markets),
//         ]);
//     });
// };

module.exports = function (deployer, network) {
};
