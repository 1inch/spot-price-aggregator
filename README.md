# Spot Price Aggregator

The 1inch spot price aggregator is a set of smart contracts that extract price data for tokens traded on DEXes from the blockchain. To avoid price manipulations within a transaction, the spot price aggregator should ONLY be used off-chain. DO NOT use it on-chain. For off-chain usage see [Examples](#examples) section below.

## Wrappers

To handle wrapped tokens, such as wETH, cDAI, aDAI etc., the 1inch spot price aggregator uses custom wrapper smart contracts that wrap/unwrap tokens at the current wrapping exchange rate. 

## Connectors

If no direct liquidity pair exists between two tokens, the spot price aggregator calculates rates for those coins using another token that has pairs with both of them – a connector token.

## Supported Deployments

### Ethereum Mainnet

#### Oracle [0x07D91f5fb9Bf7798734C3f606dB065549F6893bb](https://etherscan.io/address/0x07D91f5fb9Bf7798734C3f606dB065549F6893bb)

#### Supported DEXes

* Mooniswap
* 1inch Liquidity Protocol V1.1
* Uniswap V1
* Uniswap V2
* Sushiswap
* Equalizer.fi
* Uniswap V3
* Synthetix
* Chainlink
* Shibaswap

#### Supported wrappers

* Aave V1
* Aave V2
* Compound
* Fulcrum V1
* Fulcrum V2
* WETH
* Cream

#### Supported connectors

* ETH
* WETH
* DAI
* USDC
* USDT
* WBTC
* 1INCH

### Binance Smart Chain

#### Oracle [0xfbD61B037C325b959c0F6A7e69D8f37770C2c550](https://bscscan.com/address/0xfbD61B037C325b959c0F6A7e69D8f37770C2c550)

#### Supported DEXes

* 1inch Liquidity Protocol V1.1
* Pancakeswap
* Streetswap
* Bakeryswap
* Julswap
* Demaxswap

#### Supported wrappers

* Venus
* WBNB

#### Supported connectors

* BNB
* WBNB
* ETH
* DAI
* USDC
* USDT
* BUSD

### Polygon

#### Oracle [0x7F069df72b7A39bCE9806e3AfaF579E54D8CF2b9](https://explorer-mainnet.maticvigil.com/address/0x7F069df72b7A39bCE9806e3AfaF579E54D8CF2b9/transactions)

#### Supported DEXes

* QuickSwap
* ComethSwap
* SushiSwap
* Dfyn

#### Supported wrappers

* AAVE
* WMATIC

#### Supported connectors

* MATIC
* WMATIC

### Kovan

#### Oracle [0x29BC86Ad68bB3BD3d54841a8522e0020C1882C22](https://kovan.etherscan.io/address/0x29BC86Ad68bB3BD3d54841a8522e0020C1882C22)

#### Supported DEXes

* 1inch Liquidity Protocol V1.1
* Uniswap V2
* Uniswap V1

#### Supported wrappers

* Venus
* WETH

#### Supported connectors

* ETH
* WETH

### Optimism

#### Oracle [0x11DEE30E710B8d4a8630392781Cc3c0046365d4c](https://optimistic.etherscan.io/address/0x11DEE30E710B8d4a8630392781Cc3c0046365d4c)

#### Supported DEXes

* Uniswap V3
* Synthetix

### Arbitrum

#### Oracle [0x735247fb0a604c0adC6cab38ACE16D0DbA31295F](https://arbiscan.io/address/0x735247fb0a604c0adc6cab38ace16d0dba31295f)

#### Supported DEXes

* Uniswap V3
* Sushiswap
* Swapr

### Avax

#### Oracle [0xBd0c7AaF0bF082712EbE919a9dD94b2d978f79A9](https://snowtrace.io/address/0xBd0c7AaF0bF082712EbE919a9dD94b2d978f79A9)

#### Supported DEXes

* Trader Joe
* Pangolin Exchange

### xDai

#### Oracle [0x142DB045195CEcaBe415161e1dF1CF0337A4d02E](https://blockscout.com/xdai/mainnet/address/0x142DB045195CEcaBe415161e1dF1CF0337A4d02E)

#### Supported DEXes

* Honeyswap
* Levinswap
* Swapr
* Sushiswap

## Examples

* [Single token-to-ETH price usage](https://github.com/1inch-exchange/offchain-oracle/blob/master/examples/single-price.js)

* [Multiple token-to-ETH prices usage](https://github.com/1inch-exchange/offchain-oracle/blob/master/examples/multiple-prices.js)
