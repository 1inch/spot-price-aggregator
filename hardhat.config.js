require('@eth-optimism/hardhat-ovm');
require('@nomiclabs/hardhat-ethers');
require('@nomiclabs/hardhat-etherscan');
require('@nomiclabs/hardhat-truffle5');
require('hardhat-deploy');
require('hardhat-gas-reporter');
require('solidity-coverage');

require('dotenv').config();

const networks = require('./hardhat.networks');

module.exports = {
    ovm: {
        solcVersion: '0.7.6',
    },
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
        apiKey: process.env.MAINNET_ETHERSCAN_KEY,
    },
    gasReporter: {
        enable: true,
        currency: 'USD',
    },
    mocha: {
        timeout: 90000,
    },
};
