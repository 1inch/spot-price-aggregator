const networks = {
    hardhat: {
        forking: {
            url: process.env.MAINNET_RPC_URL,
        },
        gasPrice: 1000000000,
        blockGasLimit: 1000000000,
    },
};

if (process.env.MAINNET_RPC_URL && process.env.MAINNET_PRIVATE_KEY) {
    networks.mainnet = {
        url: process.env.MAINNET_RPC_URL,
        chainId: 1,
        gasPrice: 15000000000,
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

if (process.env.KOVAN_RPC_URL && process.env.KOVAN_PRIVATE_KEY) {
    networks.kovan = {
        url: process.env.KOVAN_RPC_URL,
        chainId: 42,
        gasPrice: 1000000000,
        accounts: [process.env.KOVAN_PRIVATE_KEY],
    };
}

if (process.env.MATIC_RPC_URL && process.env.MATIC_PRIVATE_KEY) {
    networks.matic = {
        url: process.env.MATIC_RPC_URL,
        chainId: 137,
        gasPrice: 1000000000,
        accounts: [process.env.MATIC_PRIVATE_KEY],
    };
}

if (process.env.OPTIMISM_KOVAN_RPC_URL && process.env.OPTIMISM_KOVAN_PRIVATE_KEY) {
    networks['optimism-kovan'] = {
        url: process.env.OPTIMISM_KOVAN_RPC_URL,
        chainId: 69,
        gasPrice: 0,
        accounts: [process.env.OPTIMISM_KOVAN_PRIVATE_KEY],
        ovm: true
    };
}

module.exports = networks;
