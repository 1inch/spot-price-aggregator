require('@nomiclabs/hardhat-ethers');
require('hardhat-deploy');
require('@nomiclabs/hardhat-truffle5');
require('solidity-coverage');
require('hardhat-gas-reporter');
require('dotenv').config();

const networks = require('./hardhat.networks');

module.exports = {
    solidity: {
        version: '0.7.6',
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
        apiKey: process.env.BSC_ETHERSCAN_KEY,
    },
    gasReporter: {
        enable: true,
        currency: 'USD',
    },
};
