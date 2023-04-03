<div align="center">
    <img src="https://github.com/1inch/farming/blob/master/.github/1inch_github_w.svg#gh-light-mode-only">
    <img src="https://github.com/1inch/farming/blob/master/.github/1inch_github_b.svg#gh-dark-mode-only">
</div>

# Spot Price Aggregator

[![Build Status](https://github.com/1inch/spot-price-aggregator/actions/workflows/test.yml/badge.svg)](https://github.com/1inch/spot-price-aggregator/actions)
[![Coverage Status](https://codecov.io/gh/1inch/spot-price-aggregator/branch/master/graph/badge.svg?token=6V7609YJ1Q)](https://codecov.io/gh/1inch/spot-price-aggregator)

The 1inch spot price aggregator is a set of smart contracts that extract price data for tokens traded on DEXes from the blockchain. To avoid price manipulations within a transaction, the spot price aggregator should ONLY be used off-chain. DO NOT use it on-chain. For off-chain usage see [Examples](#examples) section below.

## Wrappers

To handle wrapped tokens, such as wETH, cDAI, aDAI etc., the 1inch spot price aggregator uses custom wrapper smart contracts that wrap/unwrap tokens at the current wrapping exchange rate. 

## Connectors

If no direct liquidity pair exists between two tokens, the spot price aggregator calculates rates for those coins using another token that has pairs with both of them – a connector token.

## Supported Deployments

### Ethereum Mainnet

#### Oracle [0x07D91f5fb9Bf7798734C3f606dB065549F6893bb](https://etherscan.io/address/0x07D91f5fb9Bf7798734C3f606dB065549F6893bb)

#### Supported DEXes

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

* Aave V1 +
* Aave V2 +
* Compound +
* WETH +
* Yvault

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
* Velodrome Finance

### Arbitrum

#### Oracle [0x59Bc892E1832aE86C268fC21a91fE940830a52b0](https://arbiscan.io/address/0x59Bc892E1832aE86C268fC21a91fE940830a52b0)

<details><summary>Supported DEXes</summary>

   * DXswap - [0x750c1b699552cAf908D67F5cCFd20A261305328c](https://arbiscan.io/address/0x750c1b699552cAf908D67F5cCFd20A261305328c)
   * SushiSwap - [0xB89A664FdAf504CDc7826B97Ba6e522d9b78dbE7](https://arbiscan.io/address/0xB89A664FdAf504CDc7826B97Ba6e522d9b78dbE7)
   * UniswapV3 - [0x89314d57A8A4E636A00922ac289BC3a9a69C4361](https://arbiscan.io/address/0x89314d57A8A4E636A00922ac289BC3a9a69C4361)

</details>

<details><summary>Supported wrappers</summary>

   * WETH - [0x0F85A912448279111694F4Ba4F85dC641c54b594](https://arbiscan.io/address/0x0F85A912448279111694F4Ba4F85dC641c54b594)
   
</details>

<details><summary>Supported connectors</summary>

   * NONE - [0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF](https://arbiscan.io/address/0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF)
   * WETH - [0x82aF49447D8a07e3bd95BD0d56f35241523fBab1](https://arbiscan.io/address/0x82aF49447D8a07e3bd95BD0d56f35241523fBab1)

</details>

Prev oracle version (legacy) - [0x735247fb0a604c0adC6cab38ACE16D0DbA31295F](https://arbiscan.io/address/0x735247fb0a604c0adC6cab38ACE16D0DbA31295F)

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

### Fantom

#### Oracle [0xE8E598A1041b6fDB13999D275a202847D9b654ca](https://ftmscan.com/address/0xE8E598A1041b6fDB13999D275a202847D9b654ca)

#### Supported DEXes

* SpookySwap
* Solidex
* SpiritSwap
* Sushiswap

### Aurora

#### Oracle [0xeD55d76Bb48E042a177d1E21AffBe1B72d0c7dB0](https://aurorascan.dev/address/0xeD55d76Bb48E042a177d1E21AffBe1B72d0c7dB0)

<details><summary>Supported DEXes</summary>

   * Trisolaris - [0x587D67870CF6e733F2Ac101eD83675d6C01Ae127](https://aurorascan.dev/address/0x587D67870CF6e733F2Ac101eD83675d6C01Ae127)
   * WannaSwap - [0x7d809B3b23b62D8a455831f38b312C7c8F965D2e](https://aurorascan.dev/address/0x7d809B3b23b62D8a455831f38b312C7c8F965D2e)
   * NearPAD - [0x74bD9e4F8038DA216c3d20E9Ef6a05502Fc7129e](https://aurorascan.dev/address/0x74bD9e4F8038DA216c3d20E9Ef6a05502Fc7129e)
   * AuroraSwap - [0xfAf8d8b49D9e121816268CabE24ceF1B9B635908](https://aurorascan.dev/address/0xfAf8d8b49D9e121816268CabE24ceF1B9B635908)
   * Dodo - [0xeec05e0D8F7D3f56CECE2026Feaf41b09B423790](https://aurorascan.dev/address/0xeec05e0D8F7D3f56CECE2026Feaf41b09B423790)
   * DodoV2 - [0x11BFd590f592457b65Eb85327F5938141f61878a](https://aurorascan.dev/address/0x11BFd590f592457b65Eb85327F5938141f61878a)

</details>

<details><summary>Supported wrappers</summary>

   * WETH - [0x750c1b699552cAf908D67F5cCFd20A261305328c](https://aurorascan.dev/address/0x750c1b699552cAf908D67F5cCFd20A261305328c)
   * Aurigami - [0xc197Ab9d47206dAf739a47AC75D0833fD2b0f87F](https://aurorascan.dev/address/0xc197Ab9d47206dAf739a47AC75D0833fD2b0f87F)
   * Bastion - [0xCC54299Fc291B261B2bF5552E7F0E5d2F8613E8C](https://aurorascan.dev/address/0xCC54299Fc291B261B2bF5552E7F0E5d2F8613E8C)

</details>

<details><summary>Supported connectors</summary>

   * NONE - [0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF](https://aurorascan.dev/address/0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF)
   * ETH - [0x0000000000000000000000000000000000000000](https://aurorascan.dev/address/0x0000000000000000000000000000000000000000)
   * WETH - [0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB](https://aurorascan.dev/address/0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB)
   * NEAR - [0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d](https://aurorascan.dev/address/0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d)

</details>

Prev oracle version (legacy) - [0xE4E0552452e5cC1306A2bF5B2Fd9b1eA19418795](https://aurorascan.dev/address/0xE4E0552452e5cC1306A2bF5B2Fd9b1eA19418795)

## Examples

* [Single token-to-ETH price usage](https://github.com/1inch-exchange/offchain-oracle/blob/master/examples/single-price.js)

* [Multiple token-to-ETH prices usage](https://github.com/1inch-exchange/offchain-oracle/blob/master/examples/multiple-prices.js)
