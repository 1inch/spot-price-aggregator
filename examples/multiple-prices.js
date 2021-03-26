const Web3 = require('web3');
const { BigNumber } = require('ethers');

const yourInfuraKey = 'add your key here';
const web3 = new Web3(`https://mainnet.infura.io/${yourInfuraKey}`);

// eslint-disable-next-line max-len
const MultiCallAbi = '[{"inputs":[{"components":[{"internalType":"address","name":"to","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"}],"internalType":"struct MultiCall.Call[]","name":"calls","type":"tuple[]"}],"name":"multicall","outputs":[{"internalType":"bytes[]","name":"results","type":"bytes[]"},{"internalType":"bool[]","name":"success","type":"bool[]"}],"stateMutability":"view","type":"function"}]';
// eslint-disable-next-line max-len
const OffChainOracleAbi = '[{"inputs":[{"internalType":"contract IERC20","name":"srcToken","type":"address"},{"internalType":"contract IERC20","name":"dstToken","type":"address"}],"name":"getRate","outputs":[{"internalType":"uint256","name":"weightedRate","type":"uint256"}],"stateMutability":"view","type":"function"}]';

const offChainOracleAddress = '0x080ab73787a8b13ec7f40bd7d00d6cc07f9b24d0';

const multiCallContract = new web3.eth.Contract(JSON.parse(MultiCallAbi), '0xda3c19c6fe954576707fa24695efb830d9cca1ca');
const offChainOracleContract = new web3.eth.Contract(JSON.parse(OffChainOracleAbi));

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
    data: offChainOracleContract.methods.getRate(
        token.address,
        '0x0000000000000000000000000000000000000000', // rate to ETH
    ).encodeABI(),
}));

multiCallContract.methods.multicall(callData).call()
    .then(({
        results,
        success,
    }) => {
        const prices = {};
        for (let i = 0; i < results.length; i++) {
            if (!success[i]) {
                continue;
            }

            const decodedRate = web3.eth.abi.decodeParameter('uint256', results[i]).toString();
            const numerator = BigNumber.from(10).pow(tokens[i].decimals);
            const denominator = BigNumber.from(10).pow(18); // eth decimals
            const price = BigNumber.from(decodedRate).mul(numerator).div(denominator);
            prices[tokens[i].address] = price.toString();
        }
        console.log(prices);
        /*
            {
                '0x6b175474e89094c44da98b954eedeac495271d0f': '693902642944679',
                '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48': '693309048891737',
                '0xdac17f958d2ee523a2206206994597c13d831ec7': '690884898946626',
                '0x111111111117dc0aa78b770fa6a738034120c302': '2210854180154178'
            }
         */
    })
    .catch(console.log);
