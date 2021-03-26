require('@eth-optimism/plugins/hardhat/compiler');
require('@nomiclabs/hardhat-ethers');
require('hardhat-deploy');
require('dotenv').config();

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
    namedAccounts: {
        deployer: {
            default: 0,
        },
    },
    networks: {
        'optimism-kovan': {
            url: 'https://kovan.optimism.io',
            chainId: 69,
            gasPrice: 0,
            gas: 6000000,
            accounts: [process.env.OPTIMISM_KOVAN_PRIVATE_KEY],
        },
    },
    gasReporter: {
        enable: true,
        currency: 'USD',
    },
};
