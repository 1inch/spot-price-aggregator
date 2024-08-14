require('@matterlabs/hardhat-zksync-deploy');
require('@matterlabs/hardhat-zksync-solc');
require('@nomicfoundation/hardhat-ethers');
require('@nomicfoundation/hardhat-chai-matchers');
require('hardhat-deploy');
require('hardhat-dependency-compiler');
require('hardhat-gas-reporter');
require('hardhat-tracer');
require('solidity-coverage');

const { Networks, getNetwork } = require('@1inch/solidity-utils/hardhat-setup');

if (getNetwork().indexOf('zksync') !== -1) {
    require('@matterlabs/hardhat-zksync-verify');
} else {
    require('@nomicfoundation/hardhat-verify');
}

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
        timeout: 240000,
    },
    tracer: {
        enableAllOpcodes: true,
    },
    dependencyCompiler: {
        paths: [
            '@1inch/solidity-utils/contracts/interfaces/ICreate3Deployer.sol',
            '@1inch/solidity-utils/contracts/interfaces/IWETH.sol',
            '@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol',
        ],
    },
    zksolc: {
        version: '1.5.1',
        compilerSource: 'binary',
        settings: {},
    },
};
