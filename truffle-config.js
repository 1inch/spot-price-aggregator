const HDWalletProvider = require('@truffle/hdwallet-provider');
const privateKey = '';
const mainnetEndpointUrl = '';

module.exports = {
    networks: {
        test: {
            host: 'localhost',
            port: 9545,
            network_id: '*',
            gas: 8000000000,
            gasPrice: 1000000000, // web3.eth.gasPrice
        },
        mainnet: {
            provider: function() {
                return new HDWalletProvider({
                    privateKeys: [privateKey],
                    providerOrUrl: mainnetEndpointUrl,
                    pollingInterval: 5000
                });
            },
            gas: 6000000,
            gasPrice: 160000000000, // 160 wgei
            network_id: 1
        }
    },
    compilers: {
        solc: {
            version: '0.7.6',
            settings: {
                optimizer: {
                    enabled: true,
                    runs: 1000000,
                }
            }
        },
    },
    plugins: [
        'solidity-coverage',
        'truffle-plugin-verify'
    ],
    api_keys: {
        etherscan: ''
    },
    mocha: { // https://github.com/cgewecke/eth-gas-reporter
        reporter: 'eth-gas-reporter',
        reporterOptions : {
            currency: 'USD',
            gasPrice: 10,
            onlyCalledMethods: true,
            showTimeSpent: true,
            excludeContracts: ['mocks']
        }
    }
};
