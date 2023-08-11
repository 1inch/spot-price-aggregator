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

#### Oracle [0x52cbE0f49CcdD4Dc6E9C13BAb024EABD2842045B](https://etherscan.io/address/0x52cbE0f49CcdD4Dc6E9C13BAb024EABD2842045B)

<details><summary>Supported DEXes</summary>

   * Chainlink - [0x31B81f9D03EEe1c11Ff6c44D481e3e0451409Efe](https://etherscan.io/address/0x31B81f9D03EEe1c11Ff6c44D481e3e0451409Efe)
   * KyberDMM - [0x1b947aF8b3dd6aa96F8726cd92c894D0Ba6367a3](https://etherscan.io/address/0x1b947aF8b3dd6aa96F8726cd92c894D0Ba6367a3)
   * Mooniswap - [0xeD55d76Bb48E042a177d1E21AffBe1B72d0c7dB0](https://etherscan.io/address/0xeD55d76Bb48E042a177d1E21AffBe1B72d0c7dB0)
   * Synthetix - [0x4d4872339DEF367B1BA1D53955d8586B9F0BE63D](https://etherscan.io/address/0x4d4872339DEF367B1BA1D53955d8586B9F0BE63D)
   * Uniswap - [0x7bdc6954e1c7869B4147A320d589689F628E9921](https://etherscan.io/address/0x7bdc6954e1c7869B4147A320d589689F628E9921)
   * Equalizer - [0xeec05e0D8F7D3f56CECE2026Feaf41b09B423790](https://etherscan.io/address/0xeec05e0D8F7D3f56CECE2026Feaf41b09B423790)
   * ShibaSwap - [0x11BFd590f592457b65Eb85327F5938141f61878a](https://etherscan.io/address/0x11BFd590f592457b65Eb85327F5938141f61878a)
   * SushiSwap - [0xfAf8d8b49D9e121816268CabE24ceF1B9B635908](https://etherscan.io/address/0xfAf8d8b49D9e121816268CabE24ceF1B9B635908)
   * UniswapV2 - [0x74bD9e4F8038DA216c3d20E9Ef6a05502Fc7129e](https://etherscan.io/address/0x74bD9e4F8038DA216c3d20E9Ef6a05502Fc7129e)
   * UniswapV3 - [0x7bBc0156c31A19097eEd6B636AA2F4AB8A31BFD9](https://etherscan.io/address/0x7bBc0156c31A19097eEd6B636AA2F4AB8A31BFD9)
   * Curve - [0xb57CdEC62Df2AA93AC4C2449Eb50eB4d2f264f3e](https://etherscan.io/address/0xb57CdEC62Df2AA93AC4C2449Eb50eB4d2f264f3e)
   * Pancake 3 - [0xA57eE57aa7af7c43265A8376c3d54543Cc78C089](https://etherscan.io/address/0xA57eE57aa7af7c43265A8376c3d54543Cc78C089)
   
</details>

<details><summary>Supported wrappers</summary>

   * WETH - [0xCD9797E66c41F80B9D91B201d2F10E1bD7A268FD](https://etherscan.io/address/0xCD9797E66c41F80B9D91B201d2F10E1bD7A268FD)
   * AaveV1 - [0x8C00a411Fe8983525F82CFCe34fe4B092d9E525d](https://etherscan.io/address/0x8C00a411Fe8983525F82CFCe34fe4B092d9E525d)
   * AaveV2 - [0x06cC74503B6d1eB6D4d6Bc402f48fC07b804105f](https://etherscan.io/address/0x06cC74503B6d1eB6D4d6Bc402f48fC07b804105f)
   * Compound - [0x7C327E1Ee66d4cF7F4053387241351FDc95A0c04](https://etherscan.io/address/0x7C327E1Ee66d4cF7F4053387241351FDc95A0c04)
   * YVault - [0x9FF110f132d988bfa9bC6a21851Da1aF3aC6EaF8](https://etherscan.io/address/0x9FF110f132d988bfa9bC6a21851Da1aF3aC6EaF8)
   
</details>

<details><summary>Supported connectors</summary>

   * ETH - [0x0000000000000000000000000000000000000000](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
   * WETH - [0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2](https://etherscan.io/address/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2)
   * USDC - [0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
   * DAI - [0x6B175474E89094C44Da98b954EedeAC495271d0F](https://etherscan.io/address/0x6B175474E89094C44Da98b954EedeAC495271d0F)
   * USDT - [0xdAC17F958D2ee523a2206206994597C13D831ec7](https://etherscan.io/address/0xdAC17F958D2ee523a2206206994597C13D831ec7)
   * NONE - [0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF](https://etherscan.io/address/0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF)
   * 1INCH - [0x111111111117dC0aa78b770fA6A738034120C302](https://etherscan.io/address/0x111111111117dC0aa78b770fA6A738034120C302)
   * WBTC - [0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599](https://etherscan.io/address/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599)

</details>

<details><summary>Prev oracle versions (legacy)</summary>

   * May-28-2021 - [0x07D91f5fb9Bf7798734C3f606dB065549F6893bb](https://etherscan.io/address/0x07D91f5fb9Bf7798734C3f606dB065549F6893bb)
   * Apr-07-2023 - [0x3E1Fe1Bd5a5560972bFa2D393b9aC18aF279fF56](https://etherscan.io/address/0x3E1Fe1Bd5a5560972bFa2D393b9aC18aF279fF56)

</details>

### Binance Smart Chain

#### Oracle [0x52cbE0f49CcdD4Dc6E9C13BAb024EABD2842045B](https://bscscan.com/address/0x52cbE0f49CcdD4Dc6E9C13BAb024EABD2842045B)

<details><summary>Supported DEXes</summary>

   * ApeSwap - [0xE93293A6088d3a8abDDf62e6CA1A085Cec97D06F](https://bscscan.com/address/0xE93293A6088d3a8abDDf62e6CA1A085Cec97D06F)
   * BakerySwap - [0xCC54299Fc291B261B2bF5552E7F0E5d2F8613E8C](https://bscscan.com/address/0xCC54299Fc291B261B2bF5552E7F0E5d2F8613E8C)
   * BSCswap - [0x3Ce81621e674Db129033548CbB9FF31AEDCc1BF6](https://bscscan.com/address/0x3Ce81621e674Db129033548CbB9FF31AEDCc1BF6)
   * Demax - [0x59Bc892E1832aE86C268fC21a91fE940830a52b0](https://bscscan.com/address/0x59Bc892E1832aE86C268fC21a91fE940830a52b0)
   * KyberDmm - [0xE4E0552452e5cC1306A2bF5B2Fd9b1eA19418795](https://bscscan.com/address/0xE4E0552452e5cC1306A2bF5B2Fd9b1eA19418795)
   * Mooniswap - [0xf023D71EfB08339EA28F0C186AE130c74D44C58c](https://bscscan.com/address/0xf023D71EfB08339EA28F0C186AE130c74D44C58c)
   * Pancake 1 - [0x52a8193C7f42b75F27e4ce96f8ddBA7e854453Ef](https://bscscan.com/address/0x52a8193C7f42b75F27e4ce96f8ddBA7e854453Ef)
   * Pancake 2 - [0x9488795C688d0AAe98F2056467C13a051C954657](https://bscscan.com/address/0x9488795C688d0AAe98F2056467C13a051C954657)
   * Pancake 3 - [0x04098C93b15E5Cbb5A49651f20218C85F202Cd27](https://bscscan.com/address/0x04098C93b15E5Cbb5A49651f20218C85F202Cd27)
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

<details><summary>Prev oracle versions (legacy)</summary>

   * May-28-2021 - [0xfbD61B037C325b959c0F6A7e69D8f37770C2c550](https://bscscan.com/address/0xfbD61B037C325b959c0F6A7e69D8f37770C2c550)
   * Apr-06-2023 - [0x27950ecAeBB4462e18e8041AAF6Ea13cA47Af001](https://bscscan.com/address/0x27950ecAeBB4462e18e8041AAF6Ea13cA47Af001)

</details>

### Polygon (Matic)

#### Oracle [0x52cbE0f49CcdD4Dc6E9C13BAb024EABD2842045B](https://polygonscan.com/address/0x52cbE0f49CcdD4Dc6E9C13BAb024EABD2842045B)

<details><summary>Supported DEXes</summary>

   * QuickSwap - [0xB89A664FdAf504CDc7826B97Ba6e522d9b78dbE7](https://polygonscan.com/address/0xB89A664FdAf504CDc7826B97Ba6e522d9b78dbE7)
   * ComethSwap - [0x750c1b699552cAf908D67F5cCFd20A261305328c](https://polygonscan.com/address/0x750c1b699552cAf908D67F5cCFd20A261305328c)
   * DFYN - [0x59Bc892E1832aE86C268fC21a91fE940830a52b0](https://polygonscan.com/address/0x59Bc892E1832aE86C268fC21a91fE940830a52b0)
   * SushiSwap - [0x89314d57A8A4E636A00922ac289BC3a9a69C4361](https://polygonscan.com/address/0x89314d57A8A4E636A00922ac289BC3a9a69C4361)
   * UniswapV3 - [0xCC54299Fc291B261B2bF5552E7F0E5d2F8613E8C](https://polygonscan.com/address/0xCC54299Fc291B261B2bF5552E7F0E5d2F8613E8C)

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

<details><summary>Prev oracle versions (legacy)</summary>

   * May-28-2021 - [0x7F069df72b7A39bCE9806e3AfaF579E54D8CF2b9](https://polygonscan.com/address/0x7F069df72b7A39bCE9806e3AfaF579E54D8CF2b9)
   * Apr-05-2023 - [0xf023D71EfB08339EA28F0C186AE130c74D44C58c](https://polygonscan.com/address/0xf023D71EfB08339EA28F0C186AE130c74D44C58c)

</details>

### Optimism

#### Oracle [0x52cbE0f49CcdD4Dc6E9C13BAb024EABD2842045B](https://optimistic.etherscan.io/address/0x52cbE0f49CcdD4Dc6E9C13BAb024EABD2842045B)

<details><summary>Supported DEXes</summary>

   * UniswapV3 - [0xFdCB8fA524f84081988e6065Fc8EF060f2CF0C27](https://optimistic.etherscan.io/address/0xFdCB8fA524f84081988e6065Fc8EF060f2CF0C27)
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

<details><summary>Prev oracle versions (legacy)</summary>

   * May-28-2021 - [0x11DEE30E710B8d4a8630392781Cc3c0046365d4c](https://optimistic.etherscan.io/address/0x11DEE30E710B8d4a8630392781Cc3c0046365d4c)
   * Apr-06-2023 - [0x59Bc892E1832aE86C268fC21a91fE940830a52b0](https://optimistic.etherscan.io/address/0x59Bc892E1832aE86C268fC21a91fE940830a52b0)

</details>

### Arbitrum

#### Oracle [0x52cbE0f49CcdD4Dc6E9C13BAb024EABD2842045B](https://arbiscan.io/address/0x52cbE0f49CcdD4Dc6E9C13BAb024EABD2842045B)

<details><summary>Supported DEXes</summary>

   * DXswap - [0x750c1b699552cAf908D67F5cCFd20A261305328c](https://arbiscan.io/address/0x750c1b699552cAf908D67F5cCFd20A261305328c)
   * SushiSwap - [0xB89A664FdAf504CDc7826B97Ba6e522d9b78dbE7](https://arbiscan.io/address/0xB89A664FdAf504CDc7826B97Ba6e522d9b78dbE7)
   * UniswapV3 - [0xFdCB8fA524f84081988e6065Fc8EF060f2CF0C27](https://arbiscan.io/address/0xFdCB8fA524f84081988e6065Fc8EF060f2CF0C27)

</details>

<details><summary>Supported wrappers</summary>

   * WETH - [0x0F85A912448279111694F4Ba4F85dC641c54b594](https://arbiscan.io/address/0x0F85A912448279111694F4Ba4F85dC641c54b594)
   
</details>

<details><summary>Supported connectors</summary>

   * NONE - [0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF](https://arbiscan.io/address/0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF)
   * WETH - [0x82aF49447D8a07e3bd95BD0d56f35241523fBab1](https://arbiscan.io/address/0x82aF49447D8a07e3bd95BD0d56f35241523fBab1)

</details>

<details><summary>Prev oracle versions (legacy)</summary>

   * Sep-14-2021 - [0x735247fb0a604c0adC6cab38ACE16D0DbA31295F](https://arbiscan.io/address/0x735247fb0a604c0adC6cab38ACE16D0DbA31295F)
   * Apr-03-2023 - [0x59Bc892E1832aE86C268fC21a91fE940830a52b0](https://arbiscan.io/address/0x59Bc892E1832aE86C268fC21a91fE940830a52b0)

</details>

### Avax

#### Oracle [0x52cbE0f49CcdD4Dc6E9C13BAb024EABD2842045B](https://snowtrace.io/address/0x52cbE0f49CcdD4Dc6E9C13BAb024EABD2842045B)

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

<details><summary>Prev oracle versions (legacy)</summary>

   * Dec-23-2021 - [0xBd0c7AaF0bF082712EbE919a9dD94b2d978f79A9](https://snowtrace.io/address/0xBd0c7AaF0bF082712EbE919a9dD94b2d978f79A9)
   * Apr-03-2023 - [0xf023D71EfB08339EA28F0C186AE130c74D44C58c](https://snowtrace.io/address/0xf023D71EfB08339EA28F0C186AE130c74D44C58c)

</details>

### xDai

#### Oracle [0x52cbE0f49CcdD4Dc6E9C13BAb024EABD2842045B](https://gnosisscan.io/address/0x52cbE0f49CcdD4Dc6E9C13BAb024EABD2842045B)

<details><summary>Supported DEXes</summary>

   * Honeyswap - [0xCC54299Fc291B261B2bF5552E7F0E5d2F8613E8C](https://gnosisscan.io/address/0xCC54299Fc291B261B2bF5552E7F0E5d2F8613E8C)
   * Levinswap - [0xFdCB8fA524f84081988e6065Fc8EF060f2CF0C27](https://gnosisscan.io/address/0xFdCB8fA524f84081988e6065Fc8EF060f2CF0C27)
   * Swapr - [0x59Bc892E1832aE86C268fC21a91fE940830a52b0](https://gnosisscan.io/address/0x59Bc892E1832aE86C268fC21a91fE940830a52b0)
   * Sushiswap - [0xf023D71EfB08339EA28F0C186AE130c74D44C58c](https://gnosisscan.io/address/0xf023D71EfB08339EA28F0C186AE130c74D44C58c)
   
</details>

<details><summary>Supported wrappers</summary>

   * WXDAI - [0xB89A664FdAf504CDc7826B97Ba6e522d9b78dbE7](https://gnosisscan.io/address/0xB89A664FdAf504CDc7826B97Ba6e522d9b78dbE7)
   
</details>

<details><summary>Supported connectors</summary>

   * XDAI - [0x0000000000000000000000000000000000000000](https://gnosisscan.io/address/0x0000000000000000000000000000000000000000)
   * WXDAI - [0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d](https://gnosisscan.io/address/0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d)
   * NONE - [0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF](https://gnosisscan.io/address/0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF)
   * WETH - [0x6A023CCd1ff6F2045C3309768eAd9E68F978f6e1](https://gnosisscan.io/address/0x6A023CCd1ff6F2045C3309768eAd9E68F978f6e1)
   * HNY - [0x71850b7E9Ee3f13Ab46d67167341E4bDc905Eef9](https://gnosisscan.io/address/0x71850b7E9Ee3f13Ab46d67167341E4bDc905Eef9)
   * USDC - [0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83](https://gnosisscan.io/address/0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83)
   * USDT - [0x4ECaBa5870353805a9F068101A40E0f32ed605C6](https://gnosisscan.io/address/0x4ECaBa5870353805a9F068101A40E0f32ed605C6)

</details>

<details><summary>Prev oracle versions (legacy)</summary>

   * Dec-23-2021 - [0x142DB045195CEcaBe415161e1dF1CF0337A4d02E](https://blockscout.com/xdai/mainnet/address/0x142DB045195CEcaBe415161e1dF1CF0337A4d02E)
   * Apr-06-2023 - [0x3Ce81621e674Db129033548CbB9FF31AEDCc1BF6](https://gnosisscan.io/address/0x3Ce81621e674Db129033548CbB9FF31AEDCc1BF6)

</details>

### Fantom

#### Oracle [0x52cbE0f49CcdD4Dc6E9C13BAb024EABD2842045B](https://ftmscan.com/address/0x52cbE0f49CcdD4Dc6E9C13BAb024EABD2842045B)

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

<details><summary>Prev oracle versions (legacy)</summary>

   * Mar-21-2022 - [0xE8E598A1041b6fDB13999D275a202847D9b654ca](https://ftmscan.com/address/0xE8E598A1041b6fDB13999D275a202847D9b654ca)
   * Apr-04-2023 - [0xFdCB8fA524f84081988e6065Fc8EF060f2CF0C27](https://ftmscan.com/address/0xFdCB8fA524f84081988e6065Fc8EF060f2CF0C27)

</details>

### Aurora

#### Oracle [0x52cbE0f49CcdD4Dc6E9C13BAb024EABD2842045B](https://aurorascan.dev/address/0x52cbE0f49CcdD4Dc6E9C13BAb024EABD2842045B)

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

<details><summary>Prev oracle versions (legacy)</summary>

   * May-26-2022 - [0xE4E0552452e5cC1306A2bF5B2Fd9b1eA19418795](https://aurorascan.dev/address/0xE4E0552452e5cC1306A2bF5B2Fd9b1eA19418795)
   * Mar-31-2023 - [0xeD55d76Bb48E042a177d1E21AffBe1B72d0c7dB0](https://aurorascan.dev/address/0xeD55d76Bb48E042a177d1E21AffBe1B72d0c7dB0)

</details>

### Klaytn

#### Oracle [0x52cbE0f49CcdD4Dc6E9C13BAb024EABD2842045B](https://scope.klaytn.com/account/0x52cbE0f49CcdD4Dc6E9C13BAb024EABD2842045B)

<details><summary>Supported DEXes</summary>

   * KlaySwap - [0x750c1b699552cAf908D67F5cCFd20A261305328c](https://scope.klaytn.com/account/0x750c1b699552cAf908D67F5cCFd20A261305328c)
   * ClaimSwap - [0xB89A664FdAf504CDc7826B97Ba6e522d9b78dbE7](https://scope.klaytn.com/account/0xB89A664FdAf504CDc7826B97Ba6e522d9b78dbE7)

</details>

<details><summary>Supported wrappers</summary>

   * WKLAY - [0xD9Cc0A957cAC93135596f98c20Fbaca8Bf515909](https://scope.klaytn.com/account/0xD9Cc0A957cAC93135596f98c20Fbaca8Bf515909)
   * Klap - [0x4dFa40FDAA7694676899f8887A45603922609AF4](https://scope.klaytn.com/account/0x4dFa40FDAA7694676899f8887A45603922609AF4)

</details>

<details><summary>Supported connectors</summary>

   * NONE - [0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF](https://scope.klaytn.com/account/0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF)
   * KLAY - [0x0000000000000000000000000000000000000000](https://scope.klaytn.com/account/0x0000000000000000000000000000000000000000)
   * WKLAY - [0xe4f05A66Ec68B54A58B17c22107b02e0232cC817](https://scope.klaytn.com/account/0xe4f05A66Ec68B54A58B17c22107b02e0232cC817)

</details>

<details><summary>Prev oracle versions (legacy)</summary>

   * Aug-02-2022 - [0x138CE40d675F9a23E4D6127A8600308Cf7A93381](https://scope.klaytn.com/account/0x138CE40d675F9a23E4D6127A8600308Cf7A93381)
   * Apr-06-2023 - [0x89314d57A8A4E636A00922ac289BC3a9a69C4361](https://scope.klaytn.com/account/0x89314d57A8A4E636A00922ac289BC3a9a69C4361)

</details>

### zkSync

#### Oracle [0xC762d56614D3411eC6fABD56cb075D904b801613](https://explorer.zksync.io/address/0xC762d56614D3411eC6fABD56cb075D904b801613)

<details><summary>Supported DEXes</summary>

   * MuteSwitch - [0x535f5B303DA43c5B83FDe10DE3D79b734B5117C3](https://explorer.zksync.io/address/0x535f5B303DA43c5B83FDe10DE3D79b734B5117C3)
   * Syncswap - [0xdD8263F21D4DDB533C5F3B2059493b431cAEAB8d](https://explorer.zksync.io/address/0xdD8263F21D4DDB533C5F3B2059493b431cAEAB8d)

</details>

<details><summary>Supported wrappers</summary>

   * WETH - [0x2D9E7B597b53D98C60A0904DEE7d838042Db9A25](https://explorer.zksync.io/address/0x2D9E7B597b53D98C60A0904DEE7d838042Db9A25)

</details>

<details><summary>Supported connectors</summary>

   * ETH - [0x0000000000000000000000000000000000000000](https://explorer.zksync.io/address/0x0000000000000000000000000000000000000000)
   * NONE - [0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF](https://explorer.zksync.io/address/0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF)
   * WETH - [0x5AEa5775959fBC2557Cc8789bC1bf90A239D9a91](https://explorer.zksync.io/address/0x5AEa5775959fBC2557Cc8789bC1bf90A239D9a91)
   * USDC - [0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4](https://explorer.zksync.io/address/0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4)

</details>

<details><summary>Prev oracle versions (legacy)</summary>

   * Mar-28-2023 - [0x1ec0a5F6dc07E93491426d5aAAc3E2BC505Ef41C](https://explorer.zksync.io/address/0x1ec0a5F6dc07E93491426d5aAAc3E2BC505Ef41C)
   * Jun-05-2023 - [0xEE053a8333B7F804bE050B3D73289C6dbbEB2BFd](https://explorer.zksync.io/address/0xEE053a8333B7F804bE050B3D73289C6dbbEB2BFd)

</details>

### Base

#### Oracle [0x52cbE0f49CcdD4Dc6E9C13BAb024EABD2842045B](https://basescan.org/address/0x52cbE0f49CcdD4Dc6E9C13BAb024EABD2842045B)

<details><summary>Supported DEXes</summary>

   * BaseSwap - [0x750c1b699552cAf908D67F5cCFd20A261305328c](https://basescan.org/address/0x750c1b699552cAf908D67F5cCFd20A261305328c)
   * RocketSwap - [0x89314d57A8A4E636A00922ac289BC3a9a69C4361](https://basescan.org/address/0x89314d57A8A4E636A00922ac289BC3a9a69C4361)
   * SwapBased - [0x59Bc892E1832aE86C268fC21a91fE940830a52b0](https://basescan.org/address/0x59Bc892E1832aE86C268fC21a91fE940830a52b0)
   * DackieSwap - [0xE4E0552452e5cC1306A2bF5B2Fd9b1eA19418795](https://basescan.org/address/0xE4E0552452e5cC1306A2bF5B2Fd9b1eA19418795)
   * SushiSwapV3 - [0x04098C93b15E5Cbb5A49651f20218C85F202Cd27](https://basescan.org/address/0x04098C93b15E5Cbb5A49651f20218C85F202Cd27)
   * UniswapV3 - [0x715C0357F8F29FB7a71acDcaeFdde2B964824B23](https://basescan.org/address/0x715C0357F8F29FB7a71acDcaeFdde2B964824B23)
   
</details>

<details><summary>Supported wrappers</summary>

   * WETH - [0x3Ce81621e674Db129033548CbB9FF31AEDCc1BF6](https://basescan.org/address/0x3Ce81621e674Db129033548CbB9FF31AEDCc1BF6)

</details>

<details><summary>Supported connectors</summary>

   * NONE - [0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF](https://basescan.org/address/0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF)
   * WETH - [0x4200000000000000000000000000000000000006](https://basescan.org/address/0x4200000000000000000000000000000000000006)

</details>

## Examples

* [Single token-to-ETH price usage](https://github.com/1inch-exchange/offchain-oracle/blob/master/examples/single-price.js)

* [Multiple token-to-ETH prices usage](https://github.com/1inch-exchange/offchain-oracle/blob/master/examples/multiple-prices.js)
