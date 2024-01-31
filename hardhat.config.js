require('@matterlabs/hardhat-zksync-deploy');
require('@matterlabs/hardhat-zksync-solc');
require('@matterlabs/hardhat-zksync-verify');
require('@nomicfoundation/hardhat-ethers');
require('@nomicfoundation/hardhat-verify');
require('@nomicfoundation/hardhat-chai-matchers');
require('hardhat-deploy');
require('hardhat-dependency-compiler');
require('hardhat-gas-reporter');
require('hardhat-tracer');
require('solidity-coverage');

const { Networks, getNetwork } = require('@1inch/solidity-utils/hardhat-setup');

const { networks, etherscan } = (new Networks(true, 'mainnet', true)).registerAll();

module.exports = {
    solidity: {
        version: '0.8.23',
        settings: {
            optimizer: {
                enabled: true,
                runs: 1000000,
            },
            evmVersion: networks[getNetwork()]?.hardfork || 'shanghai',
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
        timeout: 120000,
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
        version: '1.3.17',
        compilerSource: 'binary',
        settings: {},
    },
};
