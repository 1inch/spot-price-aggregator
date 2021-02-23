const Web3 = require('web3');
const { BigNumber } = require('ethers');

const yourInfuraKey = 'add your key here';
const web3 = new Web3(`https://mainnet.infura.io/${yourInfuraKey}`);

const OffChainOracleAbi = '[{"inputs":[{"internalType":"contract IERC20","name":"srcToken","type":"address"},{"internalType":"contract IERC20","name":"dstToken","type":"address"}],"name":"getRate","outputs":[{"internalType":"uint256","name":"weightedRate","type":"uint256"}],"stateMutability":"view","type":"function"}]';
const offChainOracleAddress = '0x080ab73787a8b13ec7f40bd7d00d6cc07f9b24d0';
const offChainOracleContract = new web3.eth.Contract(JSON.parse(OffChainOracleAbi), offChainOracleAddress);

const token = {
    address: '0xdac17f958d2ee523a2206206994597c13d831ec7', // USDT
    decimals: 6,
};

offChainOracleContract.methods.getRate(
    token.address,
    '0x0000000000000000000000000000000000000000', // ETH
).call()
    .then((rate) => {
        const numerator = BigNumber.from(10).pow(token.decimals);
        const denominator = BigNumber.from(10).pow(18); // eth decimals
        const price = BigNumber.from(rate).mul(numerator).div(denominator);
        console.log(price.toString()); // 674075693311015
    })
    .catch(console.log);
