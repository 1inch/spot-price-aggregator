require('@matterlabs/hardhat-zksync-deploy');
require('@matterlabs/hardhat-zksync-solc');
require('@matterlabs/hardhat-zksync-verify');
require('@nomiclabs/hardhat-ethers');
require('@nomiclabs/hardhat-etherscan');
require('@nomicfoundation/hardhat-chai-matchers');
require('hardhat-deploy');
require('hardhat-gas-reporter');
require('solidity-coverage');

require('dotenv').config();

const { networks, etherscan } = require('./hardhat.networks');

module.exports = {
    solidity: {
        version: '0.8.15',
        settings: {
            optimizer: {
                enabled: true,
                runs: 1000000,
            },
            viaIR: true,
        },
    },
    etherscan,
    networks,
    namedAccounts: {
        deployer: {
            default: 0,
        },
    },
    mocha: {
        timeout: 90000,
    },
    zksolc: {
        version: '1.3.7',
        compilerSource: 'binary',
        settings: {},
    },
};
