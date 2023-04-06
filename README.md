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

#### Oracle [0x27950ecAeBB4462e18e8041AAF6Ea13cA47Af001](https://bscscan.com/address/0x27950ecAeBB4462e18e8041AAF6Ea13cA47Af001)

<details><summary>Supported DEXes</summary>

   * ApeSwap - [0xE93293A6088d3a8abDDf62e6CA1A085Cec97D06F](https://bscscan.com/address/0xE93293A6088d3a8abDDf62e6CA1A085Cec97D06F)
   * BakerySwap - [0xCC54299Fc291B261B2bF5552E7F0E5d2F8613E8C](https://bscscan.com/address/0xCC54299Fc291B261B2bF5552E7F0E5d2F8613E8C)
   * BSCswap - [0x3Ce81621e674Db129033548CbB9FF31AEDCc1BF6](https://bscscan.com/address/0x3Ce81621e674Db129033548CbB9FF31AEDCc1BF6)
   * Demax - [0x59Bc892E1832aE86C268fC21a91fE940830a52b0](https://bscscan.com/address/0x59Bc892E1832aE86C268fC21a91fE940830a52b0)
   * KyberDmm - [0xc197Ab9d47206dAf739a47AC75D0833fD2b0f87F](https://bscscan.com/address/0xc197Ab9d47206dAf739a47AC75D0833fD2b0f87F)
   * Mooniswap - [0xf023D71EfB08339EA28F0C186AE130c74D44C58c](https://bscscan.com/address/0xf023D71EfB08339EA28F0C186AE130c74D44C58c)
   * Pancake 1 - [0x52a8193C7f42b75F27e4ce96f8ddBA7e854453Ef](https://bscscan.com/address/0x52a8193C7f42b75F27e4ce96f8ddBA7e854453Ef)
   * Pancake 2 - [0x89314d57A8A4E636A00922ac289BC3a9a69C4361](https://bscscan.com/address/0x89314d57A8A4E636A00922ac289BC3a9a69C4361)
   * Thugswap - [0xFdCB8fA524f84081988e6065Fc8EF060f2CF0C27](https://bscscan.com/address/0xFdCB8fA524f84081988e6065Fc8EF060f2CF0C27)
   
</details>

<details><summary>Supported wrappers</summary>

   * Venus - [0x11DEE30E710B8d4a8630392781Cc3c0046365d4c](https://bscscan.com/address/0x11DEE30E710B8d4a8630392781Cc3c0046365d4c)
   * WBNB - [0x54431918cec22932fcf97e54769f4e00f646690f](https://bscscan.com/address/0x54431918cec22932fcf97e54769f4e00f646690f)
   
</details>

<details><summary>Supported connectors</summary>

   * NONE - [0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF](https://bscscan.com/address/0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF)
   * WBNB - [0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c](https://bscscan.com/address/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c)
   * DAI - [0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3](https://bscscan.com/address/0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3)
   * ETH - [0x2170Ed0880ac9A755fd29B2688956BD959F933F8](https://bscscan.com/address/0x2170Ed0880ac9A755fd29B2688956BD959F933F8)
   * USDC - [0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d](https://bscscan.com/address/0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d)
   * BSC-USD - [0x55d398326f99059fF775485246999027B3197955](https://bscscan.com/address/0x55d398326f99059fF775485246999027B3197955)
   * BUSD - [0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56](https://bscscan.com/address/0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56)
   * 1INCH - [0x111111111117dC0aa78b770fA6A738034120C302](https://bscscan.com/address/0x111111111117dC0aa78b770fA6A738034120C302)

</details>

Prev oracle version (legacy) - [0xfbD61B037C325b959c0F6A7e69D8f37770C2c550](https://bscscan.com/address/0xfbD61B037C325b959c0F6A7e69D8f37770C2c550)

### Polygon

#### Oracle [0xf023D71EfB08339EA28F0C186AE130c74D44C58c](https://polygonscan.com/address/0xf023D71EfB08339EA28F0C186AE130c74D44C58c)

<details><summary>Supported DEXes</summary>

   * QuickSwap - [0xB89A664FdAf504CDc7826B97Ba6e522d9b78dbE7](https://polygonscan.com/address/0xB89A664FdAf504CDc7826B97Ba6e522d9b78dbE7)
   * ComethSwap - [0x750c1b699552cAf908D67F5cCFd20A261305328c](https://polygonscan.com/address/0x750c1b699552cAf908D67F5cCFd20A261305328c)
   * DFYN - [0x59Bc892E1832aE86C268fC21a91fE940830a52b0](https://polygonscan.com/address/0x59Bc892E1832aE86C268fC21a91fE940830a52b0)
   * SushiSwap - [0x89314d57A8A4E636A00922ac289BC3a9a69C4361](https://polygonscan.com/address/0x89314d57A8A4E636A00922ac289BC3a9a69C4361)
   * UniswapV3 - [0xFdCB8fA524f84081988e6065Fc8EF060f2CF0C27](https://polygonscan.com/address/0xFdCB8fA524f84081988e6065Fc8EF060f2CF0C27)

</details>

<details><summary>Supported wrappers</summary>

   * WMATIC - [0xA0446D8804611944F1B527eCD37d7dcbE442caba](https://polygonscan.com/address/0xA0446D8804611944F1B527eCD37d7dcbE442caba)
   * AaveV2 - [0x138CE40d675F9a23E4D6127A8600308Cf7A93381](https://polygonscan.com/address/0x138CE40d675F9a23E4D6127A8600308Cf7A93381)
   
</details>

<details><summary>Supported connectors</summary>

   * NONE - [0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF](https://polygonscan.com/address/0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF)
   * WMATIC - [0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270](https://polygonscan.com/address/0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270)
   * USDC - [0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174](https://polygonscan.com/address/0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174)

</details>

Prev oracle version (legacy) - [0x7F069df72b7A39bCE9806e3AfaF579E54D8CF2b9](https://polygonscan.com/address/0x7F069df72b7A39bCE9806e3AfaF579E54D8CF2b9)

### Kovan [deprecated]

#### Oracle [0x29BC86Ad68bB3BD3d54841a8522e0020C1882C22](https://kovan.etherscan.io/address/0x29BC86Ad68bB3BD3d54841a8522e0020C1882C22)

<details><summary>Supported DEXes</summary>

   * 1inch Liquidity Protocol V1.1 - [0xb707d89D29c189421163515c59E42147371D6857](https://kovan.etherscan.io/address/0xb707d89D29c189421163515c59E42147371D6857)
   * UniswapV2 - [0x57da811a9EF9b79DbC2EA6f6dc39368a8Da1Cf07](https://kovan.etherscan.io/address/0x57da811a9EF9b79DbC2EA6f6dc39368a8Da1Cf07)
   * UniswapV1 - [0x11431a89893025D2a48dCA4EddC396f8C8117187](https://kovan.etherscan.io/address/0x11431a89893025D2a48dCA4EddC396f8C8117187)

</details>

<details><summary>Supported wrappers</summary>

   * Venus
   * WETH - [0x93131EFeE501d5721737C32576238F619548edda](https://kovan.etherscan.io/address/0x93131EFeE501d5721737C32576238F619548edda)

</details>

<details><summary>Supported connectors</summary>

   * ETH
   * WETH - [0xd0A1E359811322d97991E03f863a0C30C2cF029C](https://arbiscan.io/address/0xd0A1E359811322d97991E03f863a0C30C2cF029C)

</details>

### Kovan-Optimism [deprecated]

#### Oracle [0xfcA5cc20A00D8acf04D0C1793C94D01D3ab07D48](https://kovan-optimistic.etherscan.io/address/0xfcA5cc20A00D8acf04D0C1793C94D01D3ab07D48)

<details><summary>Supported DEXes</summary>

   * UniswapV3 - [0x25Ea4bA2E0011B201D06662170d5115fa57F5787](https://kovan-optimistic.etherscan.io/address/0x25Ea4bA2E0011B201D06662170d5115fa57F5787)

</details>

### Optimism

#### Oracle [0x59Bc892E1832aE86C268fC21a91fE940830a52b0](https://optimistic.etherscan.io/address/0x59Bc892E1832aE86C268fC21a91fE940830a52b0)

<details><summary>Supported DEXes</summary>

   * UniswapV3 - [0xB89A664FdAf504CDc7826B97Ba6e522d9b78dbE7](https://optimistic.etherscan.io/address/0xB89A664FdAf504CDc7826B97Ba6e522d9b78dbE7)
   * Velodrome Finance - [0x750c1b699552cAf908D67F5cCFd20A261305328c](https://optimistic.etherscan.io/address/0x750c1b699552cAf908D67F5cCFd20A261305328c)
   * Synthetix - [0x89314d57A8A4E636A00922ac289BC3a9a69C4361](https://optimistic.etherscan.io/address/0x89314d57A8A4E636A00922ac289BC3a9a69C4361)

</details>

<details><summary>Supported wrappers</summary>

   * // todo: add BaseCoinWrapper
   
</details>

<details><summary>Supported connectors</summary>

   * NONE - [0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF](https://optimistic.etherscan.io/address/0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF)
   * WETH - [0x4200000000000000000000000000000000000006](https://optimistic.etherscan.io/address/0x4200000000000000000000000000000000000006)
   * USDC - [0x7F5c764cBc14f9669B88837ca1490cCa17c31607](https://optimistic.etherscan.io/address/0x7F5c764cBc14f9669B88837ca1490cCa17c31607)
   * USDT - [0x94b008aA00579c1307B0EF2c499aD98a8ce58e58](https://optimistic.etherscan.io/address/0x94b008aA00579c1307B0EF2c499aD98a8ce58e58)
   * DAI - [0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1](https://optimistic.etherscan.io/address/0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1)
   * WBTC - [0x68f180fcCe6836688e9084f035309E29Bf0A2095](https://optimistic.etherscan.io/address/0x68f180fcCe6836688e9084f035309E29Bf0A2095)
   * OP - [0x4200000000000000000000000000000000000042](https://optimistic.etherscan.io/address/0x4200000000000000000000000000000000000042)

</details>

Prev oracle version (legacy) - [0x11DEE30E710B8d4a8630392781Cc3c0046365d4c](https://optimistic.etherscan.io/address/0x11DEE30E710B8d4a8630392781Cc3c0046365d4c)

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

#### Oracle [0xf023D71EfB08339EA28F0C186AE130c74D44C58c](https://snowtrace.io/address/0xf023D71EfB08339EA28F0C186AE130c74D44C58c)

<details><summary>Supported DEXes</summary>

   * Joe - [0xB89A664FdAf504CDc7826B97Ba6e522d9b78dbE7](https://snowtrace.io/address/0xB89A664FdAf504CDc7826B97Ba6e522d9b78dbE7)
   * Pangolin - [0x750c1b699552cAf908D67F5cCFd20A261305328c](https://snowtrace.io/address/0x750c1b699552cAf908D67F5cCFd20A261305328c)
   * SushiSwap - [0x89314d57A8A4E636A00922ac289BC3a9a69C4361](https://snowtrace.io/address/0x89314d57A8A4E636A00922ac289BC3a9a69C4361)

</details>

<details><summary>Supported wrappers</summary>

   * WAVAX - [0x046605839c01C54921f4aA1AAa245E88227707D8](https://snowtrace.io/address/0x046605839c01C54921f4aA1AAa245E88227707D8)
   * AaveV2 - [0x8Aa57827C3D147E39F1058517939461538D9C56A](https://snowtrace.io/address/0x8Aa57827C3D147E39F1058517939461538D9C56A)
   
</details>

<details><summary>Supported connectors</summary>

   * NONE - [0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF](https://arbiscan.io/address/0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF)
   * WAVAX - [0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7](https://snowtrace.io/address/0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7)
   * WETH.e - [0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB](https://snowtrace.io/address/0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB)
   * USDT.e - [0xc7198437980c041c805A1EDcbA50c1Ce5db95118](https://snowtrace.io/address/0xc7198437980c041c805A1EDcbA50c1Ce5db95118)
   * WBTC.e - [0x50b7545627a5162F82A992c33b87aDc75187B218](https://snowtrace.io/address/0x50b7545627a5162F82A992c33b87aDc75187B218)
   * USDC.e - [0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664](https://snowtrace.io/address/0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664)

</details>

Prev oracle version (legacy) - [0xBd0c7AaF0bF082712EbE919a9dD94b2d978f79A9](https://snowtrace.io/address/0xBd0c7AaF0bF082712EbE919a9dD94b2d978f79A9)

### xDai

#### Oracle [0x142DB045195CEcaBe415161e1dF1CF0337A4d02E](https://blockscout.com/xdai/mainnet/address/0x142DB045195CEcaBe415161e1dF1CF0337A4d02E)

#### Supported DEXes

* Honeyswap
* Levinswap
* Swapr
* Sushiswap

### Fantom

#### Oracle [0xFdCB8fA524f84081988e6065Fc8EF060f2CF0C27](https://ftmscan.com/address/0xFdCB8fA524f84081988e6065Fc8EF060f2CF0C27)

<details><summary>Supported DEXes</summary>

   * Solidex - [0x750c1b699552cAf908D67F5cCFd20A261305328c](https://ftmscan.com/address/0x750c1b699552cAf908D67F5cCFd20A261305328c)
   * SpiritSwap - [0x89314d57A8A4E636A00922ac289BC3a9a69C4361](https://ftmscan.com/address/0x89314d57A8A4E636A00922ac289BC3a9a69C4361)
   * Spooky - [0xB89A664FdAf504CDc7826B97Ba6e522d9b78dbE7](https://ftmscan.com/address/0xB89A664FdAf504CDc7826B97Ba6e522d9b78dbE7)
   * SushiSwap - [0x59Bc892E1832aE86C268fC21a91fE940830a52b0](https://ftmscan.com/address/0x59Bc892E1832aE86C268fC21a91fE940830a52b0)

</details>

<details><summary>Supported wrappers</summary>

   * WFTM - [0x046605839c01C54921f4aA1AAa245E88227707D8](https://ftmscan.com/address/0x046605839c01C54921f4aA1AAa245E88227707D8)
   * AaveV2 - [0xa0c978c28AB8aEfc95bF58e68A05ce6B9dEAc5A9](https://ftmscan.com/address/0xa0c978c28AB8aEfc95bF58e68A05ce6B9dEAc5A9)
   * Scream - [0x7d18d5Ba1FA30Da1AD757c57eb643564CA02922D](https://ftmscan.com/address/0x7d18d5Ba1FA30Da1AD757c57eb643564CA02922D)
   
</details>

<details><summary>Supported connectors</summary>

   * NONE - [0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF](https://ftmscan.com/address/0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF)
   * WFTM - [0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83](https://ftmscan.com/address/0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83)

</details>

Prev oracle version (legacy) - [0xE8E598A1041b6fDB13999D275a202847D9b654ca](https://ftmscan.com/address/0xE8E598A1041b6fDB13999D275a202847D9b654ca)


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
