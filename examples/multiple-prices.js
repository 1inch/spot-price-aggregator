const ethers = require('ethers');

const yourInfuraKey = process.env.INFURA_API_KEY || 'add your key here';
const provider = new ethers.JsonRpcProvider(`https://mainnet.infura.io/v3/${yourInfuraKey}`);

// eslint-disable-next-line max-len
const MultiCallAbi = [{ inputs: [{ components: [{ internalType: 'address', name: 'to', type: 'address' }, { internalType: 'bytes', name: 'data', type: 'bytes' }], internalType: 'struct MultiCall.Call[]', name: 'calls', type: 'tuple[]' }], name: 'multicall', outputs: [{ internalType: 'bytes[]', name: 'results', type: 'bytes[]' }, { internalType: 'bool[]', name: 'success', type: 'bool[]' }], stateMutability: 'view', type: 'function' }];
// eslint-disable-next-line max-len
const OffChainOracleAbi = [{ inputs: [{ internalType: 'contract MultiWrapper', name: '_multiWrapper', type: 'address' }, { internalType: 'contract IOracle[]', name: 'existingOracles', type: 'address[]' }, { internalType: 'enum OffchainOracle.OracleType[]', name: 'oracleTypes', type: 'uint8[]' }, { internalType: 'contract IERC20[]', name: 'existingConnectors', type: 'address[]' }, { internalType: 'contract IERC20', name: 'wBase', type: 'address' }, { internalType: 'address', name: 'owner', type: 'address' }], stateMutability: 'nonpayable', type: 'constructor' }, { inputs: [], name: 'ArraysLengthMismatch', type: 'error' }, { inputs: [], name: 'ConnectorAlreadyAdded', type: 'error' }, { inputs: [], name: 'InvalidOracleTokenKind', type: 'error' }, { inputs: [], name: 'OracleAlreadyAdded', type: 'error' }, { inputs: [], name: 'SameTokens', type: 'error' }, { inputs: [], name: 'TooBigThreshold', type: 'error' }, { inputs: [], name: 'UnknownConnector', type: 'error' }, { inputs: [], name: 'UnknownOracle', type: 'error' }, { anonymous: false, inputs: [{ indexed: false, internalType: 'contract IERC20', name: 'connector', type: 'address' }], name: 'ConnectorAdded', type: 'event' }, { anonymous: false, inputs: [{ indexed: false, internalType: 'contract IERC20', name: 'connector', type: 'address' }], name: 'ConnectorRemoved', type: 'event' }, { anonymous: false, inputs: [{ indexed: false, internalType: 'contract MultiWrapper', name: 'multiWrapper', type: 'address' }], name: 'MultiWrapperUpdated', type: 'event' }, { anonymous: false, inputs: [{ indexed: false, internalType: 'contract IOracle', name: 'oracle', type: 'address' }, { indexed: false, internalType: 'enum OffchainOracle.OracleType', name: 'oracleType', type: 'uint8' }], name: 'OracleAdded', type: 'event' }, { anonymous: false, inputs: [{ indexed: false, internalType: 'contract IOracle', name: 'oracle', type: 'address' }, { indexed: false, internalType: 'enum OffchainOracle.OracleType', name: 'oracleType', type: 'uint8' }], name: 'OracleRemoved', type: 'event' }, { anonymous: false, inputs: [{ indexed: true, internalType: 'address', name: 'previousOwner', type: 'address' }, { indexed: true, internalType: 'address', name: 'newOwner', type: 'address' }], name: 'OwnershipTransferred', type: 'event' }, { inputs: [{ internalType: 'contract IERC20', name: 'connector', type: 'address' }], name: 'addConnector', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [{ internalType: 'contract IOracle', name: 'oracle', type: 'address' }, { internalType: 'enum OffchainOracle.OracleType', name: 'oracleKind', type: 'uint8' }], name: 'addOracle', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [], name: 'connectors', outputs: [{ internalType: 'contract IERC20[]', name: 'allConnectors', type: 'address[]' }], stateMutability: 'view', type: 'function' }, { inputs: [{ internalType: 'contract IERC20', name: 'srcToken', type: 'address' }, { internalType: 'contract IERC20', name: 'dstToken', type: 'address' }, { internalType: 'bool', name: 'useWrappers', type: 'bool' }], name: 'getRate', outputs: [{ internalType: 'uint256', name: 'weightedRate', type: 'uint256' }], stateMutability: 'view', type: 'function' }, { inputs: [{ internalType: 'contract IERC20', name: 'srcToken', type: 'address' }, { internalType: 'bool', name: 'useSrcWrappers', type: 'bool' }], name: 'getRateToEth', outputs: [{ internalType: 'uint256', name: 'weightedRate', type: 'uint256' }], stateMutability: 'view', type: 'function' }, { inputs: [{ internalType: 'contract IERC20', name: 'srcToken', type: 'address' }, { internalType: 'bool', name: 'useSrcWrappers', type: 'bool' }, { internalType: 'contract IERC20[]', name: 'customConnectors', type: 'address[]' }, { internalType: 'uint256', name: 'thresholdFilter', type: 'uint256' }], name: 'getRateToEthWithCustomConnectors', outputs: [{ internalType: 'uint256', name: 'weightedRate', type: 'uint256' }], stateMutability: 'view', type: 'function' }, { inputs: [{ internalType: 'contract IERC20', name: 'srcToken', type: 'address' }, { internalType: 'bool', name: 'useSrcWrappers', type: 'bool' }, { internalType: 'uint256', name: 'thresholdFilter', type: 'uint256' }], name: 'getRateToEthWithThreshold', outputs: [{ internalType: 'uint256', name: 'weightedRate', type: 'uint256' }], stateMutability: 'view', type: 'function' }, { inputs: [{ internalType: 'contract IERC20', name: 'srcToken', type: 'address' }, { internalType: 'contract IERC20', name: 'dstToken', type: 'address' }, { internalType: 'bool', name: 'useWrappers', type: 'bool' }, { internalType: 'contract IERC20[]', name: 'customConnectors', type: 'address[]' }, { internalType: 'uint256', name: 'thresholdFilter', type: 'uint256' }], name: 'getRateWithCustomConnectors', outputs: [{ internalType: 'uint256', name: 'weightedRate', type: 'uint256' }], stateMutability: 'view', type: 'function' }, { inputs: [{ internalType: 'contract IERC20', name: 'srcToken', type: 'address' }, { internalType: 'contract IERC20', name: 'dstToken', type: 'address' }, { internalType: 'bool', name: 'useWrappers', type: 'bool' }, { internalType: 'uint256', name: 'thresholdFilter', type: 'uint256' }], name: 'getRateWithThreshold', outputs: [{ internalType: 'uint256', name: 'weightedRate', type: 'uint256' }], stateMutability: 'view', type: 'function' }, { inputs: [], name: 'multiWrapper', outputs: [{ internalType: 'contract MultiWrapper', name: '', type: 'address' }], stateMutability: 'view', type: 'function' }, { inputs: [], name: 'oracles', outputs: [{ internalType: 'contract IOracle[]', name: 'allOracles', type: 'address[]' }, { internalType: 'enum OffchainOracle.OracleType[]', name: 'oracleTypes', type: 'uint8[]' }], stateMutability: 'view', type: 'function' }, { inputs: [], name: 'owner', outputs: [{ internalType: 'address', name: '', type: 'address' }], stateMutability: 'view', type: 'function' }, { inputs: [{ internalType: 'contract IERC20', name: 'connector', type: 'address' }], name: 'removeConnector', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [{ internalType: 'contract IOracle', name: 'oracle', type: 'address' }, { internalType: 'enum OffchainOracle.OracleType', name: 'oracleKind', type: 'uint8' }], name: 'removeOracle', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [], name: 'renounceOwnership', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [{ internalType: 'contract MultiWrapper', name: '_multiWrapper', type: 'address' }], name: 'setMultiWrapper', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }], name: 'transferOwnership', outputs: [], stateMutability: 'nonpayable', type: 'function' }];

const multiCallAddress = '0xda3c19c6fe954576707fa24695efb830d9cca1ca';
const offChainOracleAddress = '0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8';

const multiCallContract = new ethers.Contract(multiCallAddress, MultiCallAbi, provider);
const offChainOracleContract = new ethers.Contract(offChainOracleAddress, OffChainOracleAbi, provider);

const tokens = [
    {
        address: '0x6b175474e89094c44da98b954eedeac495271d0f', // DAI
        decimals: 18,
    },
    {
        address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC
        decimals: 6,
    },
    {
        address: '0xdac17f958d2ee523a2206206994597c13d831ec7', // USDT
        decimals: 6,
    }, {
        address: '0x111111111117dc0aa78b770fa6a738034120c302', // 1INCH
        decimals: 18,
    },
];

const callData = tokens.map((token) => ({
    to: offChainOracleAddress,
    data: offChainOracleContract.interface.encodeFunctionData('getRateToEth', [
        token.address,
        true, // use wrapper
    ]),
}));

multiCallContract.multicall(callData)
    .then(({
        results,
        success,
    }) => {
        const prices = {};
        for (let i = 0; i < results.length; i++) {
            if (!success[i]) {
                continue;
            }

            const decodedRate = ethers.AbiCoder.defaultAbiCoder().decode(['uint256'], results[i]).toString();
            const numerator = 10 ** tokens[i].decimals;
            const denominator = 1e18; // eth decimals
            const price = decodedRate * numerator / denominator / 1e18;
            prices[tokens[i].address] = price.toString();
        }
        console.log(prices);
        /*
            {
                '0x6b175474e89094c44da98b954eedeac495271d0f': '0.000608668000034913',
                '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48': '0.0006103623014436664',
                '0xdac17f958d2ee523a2206206994597c13d831ec7': '0.000610483437950778',
                '0x111111111117dc0aa78b770fa6a738034120c302': '0.000155248211181017'
            }
         */
    })
    .catch(console.log);
