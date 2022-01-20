require('@nomiclabs/hardhat-ethers');
require('@nomiclabs/hardhat-etherscan');
require('@nomiclabs/hardhat-truffle5');
require('hardhat-deploy');
require('hardhat-gas-reporter');
require('solidity-coverage');

require('dotenv').config();

const networks = require('./hardhat.networks');

module.exports = {
    solidity: {
        version: '0.8.11',
        settings: {
            optimizer: {
                enabled: true,
                runs: 1000000,
            },
        },
    },
    networks,
    namedAccounts: {
        deployer: {
            default: 0,
        },
    },
    etherscan: {
        apiKey: {
            mainnet: process.env.MAINNET_ETHERSCAN_KEY,
            avalanche: process.env.AVAX_ETHERSCAN_KEY,
        },
    },
    gasReporter: {
        enable: true,
        currency: 'USD',
    },
    mocha: {
        timeout: 90000,
    },
};
