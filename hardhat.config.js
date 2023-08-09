require('@matterlabs/hardhat-zksync-deploy');
require('@matterlabs/hardhat-zksync-solc');
require('@matterlabs/hardhat-zksync-verify');
require('@nomiclabs/hardhat-ethers');
require('@nomicfoundation/hardhat-verify');
require('@nomicfoundation/hardhat-chai-matchers');
require('hardhat-deploy');
require('hardhat-dependency-compiler');
require('hardhat-gas-reporter');
require('hardhat-tracer');
require('solidity-coverage');

require('dotenv').config();

const { networks, etherscan } = require('./hardhat.networks');

module.exports = {
    solidity: {
        version: '0.8.19',
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
    paths: {
        deploy: 'deploy/commands',
    },
    mocha: {
        timeout: 90000,
    },
    tracer: {
        enableAllOpcodes: true,
    },
    dependencyCompiler: {
        paths: [
            '@1inch/solidity-utils/contracts/interfaces/ICreate3Deployer.sol',
        ],
    },
    zksolc: {
        version: '1.3.7',
        compilerSource: 'binary',
        settings: {},
    },
};
