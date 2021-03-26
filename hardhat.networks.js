const networks = {
    hardhat: {
        forking: {
            url: process.env.MAINNET_RPC_URL,
        },
        accounts: {
            mnemonic: 'test test test test test test test test test test test junk',
        },
        gasPrice: 1000000000,
    },
};

if (process.env.MAINNET_RPC_URL && process.env.MAINNET_PRIVATE_KEY) {
    networks.mainnet = {
        url: process.env.MAINNET_RPC_URL,
        chainId: 1,
        gasPrice: 120000000000,
        gas: 3000000,
        accounts: [process.env.MAINNET_PRIVATE_KEY],
    };
}

if (process.env.BSC_RPC_URL && process.env.BSC_PRIVATE_KEY) {
    networks.bsc = {
        url: process.env.BSC_RPC_URL,
        chainId: 56,
        gasPrice: 10000000000,
        accounts: [process.env.BSC_PRIVATE_KEY],
    };
}

module.exports = networks;
