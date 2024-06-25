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

#### Oracle [0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8](https://etherscan.io/address/0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8)

<details><summary>Supported DEXes</summary>

   * Chainlink - [0x8606321723D9cA7db708A8b12DAd0A8a83f2F3bD](https://etherscan.io/address/0x8606321723D9cA7db708A8b12DAd0A8a83f2F3bD)
   * KyberDMM - [0xE2d0e58302d03F703BD3c5EC2899F4e1af65E18c](https://etherscan.io/address/0xE2d0e58302d03F703BD3c5EC2899F4e1af65E18c)
   * Mooniswap - [0x5F6a6428756CfAF96584286Ef9f7411621196f3A](https://etherscan.io/address/0x5F6a6428756CfAF96584286Ef9f7411621196f3A)
   * Synthetix - [0xb7EF687B322910f3315F91f9F4B9b4B77219ddb4](https://etherscan.io/address/0xb7EF687B322910f3315F91f9F4B9b4B77219ddb4)
   * Uniswap - [0xAdF7CC69626eB6F03F4F613832C84Cf62586A6Bb](https://etherscan.io/address/0xAdF7CC69626eB6F03F4F613832C84Cf62586A6Bb)
   * Equalizer - [0xEBA383DA9FCe0Ea0acB59A185A73D48dC089c73F](https://etherscan.io/address/0xEBA383DA9FCe0Ea0acB59A185A73D48dC089c73F)
   * ShibaSwap - [0x0fE8bD9CB73ADC66561330B648a8fC62b4F58943](https://etherscan.io/address/0x0fE8bD9CB73ADC66561330B648a8fC62b4F58943)
   * SushiSwap - [0x2A45d538f460DDBEeA3a899b0674dA3DFE318faa](https://etherscan.io/address/0x2A45d538f460DDBEeA3a899b0674dA3DFE318faa)
   * UniswapV2 - [0xA21E47477DE9BbcDC962ee18a5E7D339c5a16D28](https://etherscan.io/address/0xA21E47477DE9BbcDC962ee18a5E7D339c5a16D28)
   * UniswapV3 - [0xE85B42805e046D1933EB8e1C543C4da4E5e8fFa3](https://etherscan.io/address/0xE85B42805e046D1933EB8e1C543C4da4E5e8fFa3)
   * Curve - [0x7eE5d607597598e9d642b264b7Ac2703b92Acf9B](https://etherscan.io/address/0x7eE5d607597598e9d642b264b7Ac2703b92Acf9B)
   * Pancake 3 - [0xB4039b37d09772801a51764537c167445f52F48b](https://etherscan.io/address/0xB4039b37d09772801a51764537c167445f52F48b)
   * Dodo - [0x0A7c4d89e1629f189Eb12dd716B178d1b90D9f66](https://etherscan.io/address/0x0A7c4d89e1629f189Eb12dd716B178d1b90D9f66)
   * DodoV2 - [0x03aA019F3B78110e030c34e9fA98047A1f62859A](https://etherscan.io/address/0x03aA019F3B78110e030c34e9fA98047A1f62859A)
   
</details>

<details><summary>Supported wrappers</summary>

   * WETH - [0x2b36053EB3BC1D68f51Bb7916D1503D1556f3ffc](https://etherscan.io/address/0x2b36053EB3BC1D68f51Bb7916D1503D1556f3ffc)
   * AaveV1 - [0x8C00a411Fe8983525F82CFCe34fe4B092d9E525d](https://etherscan.io/address/0x8C00a411Fe8983525F82CFCe34fe4B092d9E525d)
   * AaveV2 - [0x06cC74503B6d1eB6D4d6Bc402f48fC07b804105f](https://etherscan.io/address/0x06cC74503B6d1eB6D4d6Bc402f48fC07b804105f)
   * AaveV3 - [0x0c8fc7a71C28c768FDC1f7d75835229beBEB1573](https://etherscan.io/address/0x0c8fc7a71C28c768FDC1f7d75835229beBEB1573)
   * StataTokens (AaveV3) - [0x1A75DF59f464a70Cc8f7383983852FF72e5F5167](https://etherscan.io/address/0x1A75DF59f464a70Cc8f7383983852FF72e5F5167)
   * Compound - [0x7C327E1Ee66d4cF7F4053387241351FDc95A0c04](https://etherscan.io/address/0x7C327E1Ee66d4cF7F4053387241351FDc95A0c04)
   * CompoundV3 - [0xd24222B521337DABE4f1e56d351818fbf26905eD](https://etherscan.io/address/0xd24222B521337DABE4f1e56d351818fbf26905eD)
   * YVault - [0x9FF110f132d988bfa9bC6a21851Da1aF3aC6EaF8](https://etherscan.io/address/0x9FF110f132d988bfa9bC6a21851Da1aF3aC6EaF8)
   * stETH - [0x26daCf7E879b18FE658326ddD3ABC0D6910B3E9F](https://etherscan.io/address/0x26daCf7E879b18FE658326ddD3ABC0D6910B3E9F)
   * wstETH - [0x37eB78fE793E89353e46AEe73E299985C3B8d334](https://etherscan.io/address/0x37eB78fE793E89353e46AEe73E299985C3B8d334)
   * sDAI - [0xF07317368A4B061dadB8C8239cbfCfd4808B76ce](https://etherscan.io/address/0xF07317368A4B061dadB8C8239cbfCfd4808B76ce)
   * CHAI - [0x6fE4926a0fCc78ab764b39f2738e1Dea145d7AC0](https://etherscan.io/address/0x6fE4926a0fCc78ab764b39f2738e1Dea145d7AC0)
   
</details>

<details><summary>Supported connectors</summary>

   * ETH - [0x0000000000000000000000000000000000000000](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
   * WETH - [0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2](https://etherscan.io/address/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2)
   * USDC - [0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
   * DAI - [0x6B175474E89094C44Da98b954EedeAC495271d0F](https://etherscan.io/address/0x6B175474E89094C44Da98b954EedeAC495271d0F)
   * USDT - [0xdAC17F958D2ee523a2206206994597C13D831ec7](https://etherscan.io/address/0xdAC17F958D2ee523a2206206994597C13D831ec7)
   * NONE - [0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF](https://etherscan.io/address/0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF)
   * WBTC - [0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599](https://etherscan.io/address/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599)
   * 3CRV - [0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490](https://etherscan.io/address/0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490)

</details>

<details><summary>Prev oracle versions (legacy)</summary>

   * May-28-2021 - [0x07D91f5fb9Bf7798734C3f606dB065549F6893bb](https://etherscan.io/address/0x07D91f5fb9Bf7798734C3f606dB065549F6893bb)
   * Apr-07-2023 - [0x3E1Fe1Bd5a5560972bFa2D393b9aC18aF279fF56](https://etherscan.io/address/0x3E1Fe1Bd5a5560972bFa2D393b9aC18aF279fF56)
   * Jul-13-2023 - [0x52cbE0f49CcdD4Dc6E9C13BAb024EABD2842045B](https://etherscan.io/address/0x52cbE0f49CcdD4Dc6E9C13BAb024EABD2842045B)

</details>

### Binance Smart Chain (BSC, BNB)

#### Oracle [0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8](https://bscscan.com/address/0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8)

<details><summary>Supported DEXes</summary>

   * ApeSwap - [0xeD55d76Bb48E042a177d1E21AffBe1B72d0c7dB0](https://bscscan.com/address/0xeD55d76Bb48E042a177d1E21AffBe1B72d0c7dB0)
   * BakerySwap - [0x82b6B75F5fEabbfD370D45daCEFae3D5c06099DA](https://bscscan.com/address/0x82b6B75F5fEabbfD370D45daCEFae3D5c06099DA)
   * BSCswap - [0xD4eFb5998DFBDFB791182fb610D0061136E9DB50](https://bscscan.com/address/0xD4eFb5998DFBDFB791182fb610D0061136E9DB50)
   * Demax - [0x7bdc6954e1c7869B4147A320d589689F628E9921](https://bscscan.com/address/0x7bdc6954e1c7869B4147A320d589689F628E9921)
   * KyberDMM - [0xE2d0e58302d03F703BD3c5EC2899F4e1af65E18c](https://bscscan.com/address/0xE2d0e58302d03F703BD3c5EC2899F4e1af65E18c)
   * Mooniswap - [0x5F6a6428756CfAF96584286Ef9f7411621196f3A](https://bscscan.com/address/0x5F6a6428756CfAF96584286Ef9f7411621196f3A)
   * Pancake 1 - [0x1b947aF8b3dd6aa96F8726cd92c894D0Ba6367a3](https://bscscan.com/address/0x1b947aF8b3dd6aa96F8726cd92c894D0Ba6367a3)
   * Pancake 2 - [0xB9fa95a38D50c5Bad1eA2b4E85e106Fe886cCb3A](https://bscscan.com/address/0xB9fa95a38D50c5Bad1eA2b4E85e106Fe886cCb3A)
   * Pancake 3 - [0xB4039b37d09772801a51764537c167445f52F48b](https://bscscan.com/address/0xB4039b37d09772801a51764537c167445f52F48b)
   * Thugswap - [0x7bBc0156c31A19097eEd6B636AA2F4AB8A31BFD9](https://bscscan.com/address/0x7bBc0156c31A19097eEd6B636AA2F4AB8A31BFD9)
   * UniswapV2 - [0x4C5B9573dE7660c097F1a21050038378CD691066](https://bscscan.com/address/0x4C5B9573dE7660c097F1a21050038378CD691066)
   * UniswapV3 - [0xE85B42805e046D1933EB8e1C543C4da4E5e8fFa3](https://bscscan.com/address/0xE85B42805e046D1933EB8e1C543C4da4E5e8fFa3)
   
</details>

<details><summary>Supported wrappers</summary>

   * AaveV3 - [0x0c8fc7a71C28c768FDC1f7d75835229beBEB1573](https://bscscan.com/address/0x0c8fc7a71C28c768FDC1f7d75835229beBEB1573)
   * StataTokens (AaveV3) - [0x1A75DF59f464a70Cc8f7383983852FF72e5F5167](https://bscscan.com/address/0x1A75DF59f464a70Cc8f7383983852FF72e5F5167)
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
   * Jul-13-2023 - [0x52cbE0f49CcdD4Dc6E9C13BAb024EABD2842045B](https://bscscan.com/address/0x52cbE0f49CcdD4Dc6E9C13BAb024EABD2842045B)

</details>

### Polygon (Matic)

#### Oracle [0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8](https://polygonscan.com/address/0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8)

<details><summary>Supported DEXes</summary>

   * QuickSwap - [0xeec05e0D8F7D3f56CECE2026Feaf41b09B423790](https://polygonscan.com/address/0xeec05e0D8F7D3f56CECE2026Feaf41b09B423790)
   * ComethSwap - [0x11BFd590f592457b65Eb85327F5938141f61878a](https://polygonscan.com/address/0x11BFd590f592457b65Eb85327F5938141f61878a)
   * DFYN - [0xeD55d76Bb48E042a177d1E21AffBe1B72d0c7dB0](https://polygonscan.com/address/0xeD55d76Bb48E042a177d1E21AffBe1B72d0c7dB0)
   * SushiSwap - [0x2A45d538f460DDBEeA3a899b0674dA3DFE318faa](https://polygonscan.com/address/0x2A45d538f460DDBEeA3a899b0674dA3DFE318faa)
   * UniswapV2 - [0x4C5B9573dE7660c097F1a21050038378CD691066](https://polygonscan.com/address/0x4C5B9573dE7660c097F1a21050038378CD691066)
   * UniswapV3 - [0xE85B42805e046D1933EB8e1C543C4da4E5e8fFa3](https://polygonscan.com/address/0xE85B42805e046D1933EB8e1C543C4da4E5e8fFa3)
   * Curve - [0x0bA0D1B119d8a8E193e2802c2C7Ef1BDfAdddc49](https://polygonscan.com/address/0x0bA0D1B119d8a8E193e2802c2C7Ef1BDfAdddc49)

</details>

<details><summary>Supported wrappers</summary>

   * WMATIC - [0xA0446D8804611944F1B527eCD37d7dcbE442caba](https://polygonscan.com/address/0xA0446D8804611944F1B527eCD37d7dcbE442caba)
   * AaveV2 - [0x138CE40d675F9a23E4D6127A8600308Cf7A93381](https://polygonscan.com/address/0x138CE40d675F9a23E4D6127A8600308Cf7A93381)
   * AaveV3 - [0x0c8fc7a71C28c768FDC1f7d75835229beBEB1573](https://polygonscan.com/address/0x0c8fc7a71C28c768FDC1f7d75835229beBEB1573)
   * StataTokens (AaveV3) - [0x1A75DF59f464a70Cc8f7383983852FF72e5F5167](https://polygonscan.com/address/0x1A75DF59f464a70Cc8f7383983852FF72e5F5167)
   * CompoundV3 - [0xAc63D130525c251EbB24E010c2959a98c80B993a](https://polygonscan.com/address/0xAc63D130525c251EbB24E010c2959a98c80B993a)
   
</details>

<details><summary>Supported connectors</summary>

   * MATIC - [0x0000000000000000000000000000000000000000](https://polygonscan.com/address/0x0000000000000000000000000000000000000000)
   * NONE - [0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF](https://polygonscan.com/address/0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF)
   * WMATIC - [0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270](https://polygonscan.com/address/0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270)
   * USDC - [0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174](https://polygonscan.com/address/0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174)
   * USDT - [0xc2132D05D31c914a87C6611C10748AEb04B58e8F](https://polygonscan.com/address/0xc2132D05D31c914a87C6611C10748AEb04B58e8F)
   * WETH - [0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619](https://polygonscan.com/address/0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619)

</details>

<details><summary>Prev oracle versions (legacy)</summary>

   * May-28-2021 - [0x7F069df72b7A39bCE9806e3AfaF579E54D8CF2b9](https://polygonscan.com/address/0x7F069df72b7A39bCE9806e3AfaF579E54D8CF2b9)
   * Apr-05-2023 - [0xf023D71EfB08339EA28F0C186AE130c74D44C58c](https://polygonscan.com/address/0xf023D71EfB08339EA28F0C186AE130c74D44C58c)
   * Jul-13-2023 - [0x52cbE0f49CcdD4Dc6E9C13BAb024EABD2842045B](https://polygonscan.com/address/0x52cbE0f49CcdD4Dc6E9C13BAb024EABD2842045B)

</details>

### Optimism (Optimistic)

#### Oracle [0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8](https://optimistic.etherscan.io/address/0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8)

<details><summary>Supported DEXes</summary>

   * UniswapV2 - [0x4C5B9573dE7660c097F1a21050038378CD691066](https://optimistic.etherscan.io/address/0x4C5B9573dE7660c097F1a21050038378CD691066)
   * UniswapV3 - [0xE85B42805e046D1933EB8e1C543C4da4E5e8fFa3](https://optimistic.etherscan.io/address/0xE85B42805e046D1933EB8e1C543C4da4E5e8fFa3)
   * Velodrome Finance - [0x52a8193C7f42b75F27e4ce96f8ddBA7e854453Ef](https://optimistic.etherscan.io/address/0x52a8193C7f42b75F27e4ce96f8ddBA7e854453Ef)
   * VelodromeV2 - [0xD4eFb5998DFBDFB791182fb610D0061136E9DB50](https://optimistic.etherscan.io/address/0xD4eFb5998DFBDFB791182fb610D0061136E9DB50)
   * Synthetix - [0xb7EF687B322910f3315F91f9F4B9b4B77219ddb4](https://optimistic.etherscan.io/address/0xb7EF687B322910f3315F91f9F4B9b4B77219ddb4)
   * Slipstream - [0xeD55d76Bb48E042a177d1E21AffBe1B72d0c7dB0](https://optimistic.etherscan.io/address/0xeD55d76Bb48E042a177d1E21AffBe1B72d0c7dB0)
   * Curve - [0x0bA0D1B119d8a8E193e2802c2C7Ef1BDfAdddc49](https://optimistic.etherscan.io/address/0x0bA0D1B119d8a8E193e2802c2C7Ef1BDfAdddc49)

</details>

<details><summary>Supported wrappers</summary>

   * AaveV3 - [0x0c8fc7a71C28c768FDC1f7d75835229beBEB1573](https://optimistic.etherscan.io/address/0x0c8fc7a71C28c768FDC1f7d75835229beBEB1573)
   * StataTokens (AaveV3) - [0x1A75DF59f464a70Cc8f7383983852FF72e5F5167](https://optimistic.etherscan.io/address/0x1A75DF59f464a70Cc8f7383983852FF72e5F5167)
   * // todo: add BaseCoinWrapper
   
</details>

<details><summary>Supported connectors</summary>

   * NONE - [0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF](https://optimistic.etherscan.io/address/0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF)
   * WETH - [0x4200000000000000000000000000000000000006](https://optimistic.etherscan.io/address/0x4200000000000000000000000000000000000006)
   * USDC.e - [0x7F5c764cBc14f9669B88837ca1490cCa17c31607](https://optimistic.etherscan.io/address/0x7F5c764cBc14f9669B88837ca1490cCa17c31607)
   * USDC - [0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85](https://optimistic.etherscan.io/address/0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85)
   * USDT - [0x94b008aA00579c1307B0EF2c499aD98a8ce58e58](https://optimistic.etherscan.io/address/0x94b008aA00579c1307B0EF2c499aD98a8ce58e58)
   * DAI - [0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1](https://optimistic.etherscan.io/address/0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1)
   * WBTC - [0x68f180fcCe6836688e9084f035309E29Bf0A2095](https://optimistic.etherscan.io/address/0x68f180fcCe6836688e9084f035309E29Bf0A2095)
   * OP - [0x4200000000000000000000000000000000000042](https://optimistic.etherscan.io/address/0x4200000000000000000000000000000000000042)

</details>

<details><summary>Prev oracle versions (legacy)</summary>

   * May-28-2021 - [0x11DEE30E710B8d4a8630392781Cc3c0046365d4c](https://optimistic.etherscan.io/address/0x11DEE30E710B8d4a8630392781Cc3c0046365d4c)
   * Apr-06-2023 - [0x59Bc892E1832aE86C268fC21a91fE940830a52b0](https://optimistic.etherscan.io/address/0x59Bc892E1832aE86C268fC21a91fE940830a52b0)
   * Jul-13-2023 - [0x52cbE0f49CcdD4Dc6E9C13BAb024EABD2842045B](https://optimistic.etherscan.io/address/0x52cbE0f49CcdD4Dc6E9C13BAb024EABD2842045B)

</details>

### Arbitrum

#### Oracle [0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8](https://arbiscan.io/address/0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8)

<details><summary>Supported DEXes</summary>

   * DXswap - [0xc197Ab9d47206dAf739a47AC75D0833fD2b0f87F](https://arbiscan.io/address/0xc197Ab9d47206dAf739a47AC75D0833fD2b0f87F)
   * SushiSwap - [0x2A45d538f460DDBEeA3a899b0674dA3DFE318faa](https://arbiscan.io/address/0x2A45d538f460DDBEeA3a899b0674dA3DFE318faa)
   * UniswapV2 - [0x4C5B9573dE7660c097F1a21050038378CD691066](https://arbiscan.io/address/0x4C5B9573dE7660c097F1a21050038378CD691066)
   * UniswapV3 - [0xE85B42805e046D1933EB8e1C543C4da4E5e8fFa3](https://arbiscan.io/address/0xE85B42805e046D1933EB8e1C543C4da4E5e8fFa3)
   * Curve - [0x0bA0D1B119d8a8E193e2802c2C7Ef1BDfAdddc49](https://arbiscan.io/address/0x0bA0D1B119d8a8E193e2802c2C7Ef1BDfAdddc49)

</details>

<details><summary>Supported wrappers</summary>

   * WETH - [0x0F85A912448279111694F4Ba4F85dC641c54b594](https://arbiscan.io/address/0x0F85A912448279111694F4Ba4F85dC641c54b594)
   * AaveV3 - [0x0c8fc7a71C28c768FDC1f7d75835229beBEB1573](https://arbiscan.io/address/0x0c8fc7a71C28c768FDC1f7d75835229beBEB1573)
   * StataTokens (AaveV3) - [0x1A75DF59f464a70Cc8f7383983852FF72e5F5167](https://arbiscan.io/address/0x1A75DF59f464a70Cc8f7383983852FF72e5F5167)
   * CompoundV3 - [0x04098C93b15E5Cbb5A49651f20218C85F202Cd27](https://arbiscan.io/address/0x04098C93b15E5Cbb5A49651f20218C85F202Cd27)
   
</details>

<details><summary>Supported connectors</summary>

   * NONE - [0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF](https://arbiscan.io/address/0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF)
   * ETH - [0x0000000000000000000000000000000000000000](https://arbiscan.io/address/0x0000000000000000000000000000000000000000)
   * WETH - [0x82aF49447D8a07e3bd95BD0d56f35241523fBab1](https://arbiscan.io/address/0x82aF49447D8a07e3bd95BD0d56f35241523fBab1)
   * USDC - [0xaf88d065e77c8cC2239327C5EDb3A432268e5831](https://arbiscan.io/address/0xaf88d065e77c8cC2239327C5EDb3A432268e5831)

</details>

<details><summary>Prev oracle versions (legacy)</summary>

   * Sep-14-2021 - [0x735247fb0a604c0adC6cab38ACE16D0DbA31295F](https://arbiscan.io/address/0x735247fb0a604c0adC6cab38ACE16D0DbA31295F)
   * Apr-03-2023 - [0x59Bc892E1832aE86C268fC21a91fE940830a52b0](https://arbiscan.io/address/0x59Bc892E1832aE86C268fC21a91fE940830a52b0)
   * Jul-13-2023 - [0x52cbE0f49CcdD4Dc6E9C13BAb024EABD2842045B](https://arbiscan.io/address/0x52cbE0f49CcdD4Dc6E9C13BAb024EABD2842045B)

</details>

### Avalanche (Avax)

#### Oracle [0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8](https://snowtrace.io/address/0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8)

<details><summary>Supported DEXes</summary>

   * Joe - [0xc197Ab9d47206dAf739a47AC75D0833fD2b0f87F](https://snowtrace.io/address/0xc197Ab9d47206dAf739a47AC75D0833fD2b0f87F)
   * Pangolin - [0xE93293A6088d3a8abDDf62e6CA1A085Cec97D06F](https://snowtrace.io/address/0xE93293A6088d3a8abDDf62e6CA1A085Cec97D06F)
   * SushiSwap - [0x2A45d538f460DDBEeA3a899b0674dA3DFE318faa](https://snowtrace.io/address/0x2A45d538f460DDBEeA3a899b0674dA3DFE318faa)
   * UniswapV2 - [0x4C5B9573dE7660c097F1a21050038378CD691066](https://snowtrace.io/address/0x4C5B9573dE7660c097F1a21050038378CD691066)
   * UniswapV3 - [0xE85B42805e046D1933EB8e1C543C4da4E5e8fFa3](https://snowtrace.io/address/0xE85B42805e046D1933EB8e1C543C4da4E5e8fFa3)
   * Curve - [0x8e38ec1f7D3D40ebf3987DaB0fb2aD688D96c3D1](https://snowtrace.io/address/0x8e38ec1f7D3D40ebf3987DaB0fb2aD688D96c3D1)

</details>

<details><summary>Supported wrappers</summary>

   * WAVAX - [0x046605839c01C54921f4aA1AAa245E88227707D8](https://snowtrace.io/address/0x046605839c01C54921f4aA1AAa245E88227707D8)
   * AaveV2 - [0x8Aa57827C3D147E39F1058517939461538D9C56A](https://snowtrace.io/address/0x8Aa57827C3D147E39F1058517939461538D9C56A)
   * AaveV3 - [0x0c8fc7a71C28c768FDC1f7d75835229beBEB1573](https://snowtrace.io/address/0x0c8fc7a71C28c768FDC1f7d75835229beBEB1573)
   * StataTokens (AaveV3) - [0x1A75DF59f464a70Cc8f7383983852FF72e5F5167](https://snowtrace.io/address/0x1A75DF59f464a70Cc8f7383983852FF72e5F5167)
   
</details>

<details><summary>Supported connectors</summary>

   * NONE - [0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF](https://arbiscan.io/address/0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF)
   * AVAX - [0x0000000000000000000000000000000000000000](https://arbiscan.io/address/0x0000000000000000000000000000000000000000)
   * WAVAX - [0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7](https://snowtrace.io/address/0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7)
   * WETH.e - [0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB](https://snowtrace.io/address/0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB)
   * USDT.e - [0xc7198437980c041c805A1EDcbA50c1Ce5db95118](https://snowtrace.io/address/0xc7198437980c041c805A1EDcbA50c1Ce5db95118)
   * WBTC.e - [0x50b7545627a5162F82A992c33b87aDc75187B218](https://snowtrace.io/address/0x50b7545627a5162F82A992c33b87aDc75187B218)
   * USDC.e - [0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664](https://snowtrace.io/address/0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664)
   * USDC - [0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E](https://snowtrace.io/address/0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E)

</details>

<details><summary>Prev oracle versions (legacy)</summary>

   * Dec-23-2021 - [0xBd0c7AaF0bF082712EbE919a9dD94b2d978f79A9](https://snowtrace.io/address/0xBd0c7AaF0bF082712EbE919a9dD94b2d978f79A9)
   * Apr-03-2023 - [0xf023D71EfB08339EA28F0C186AE130c74D44C58c](https://snowtrace.io/address/0xf023D71EfB08339EA28F0C186AE130c74D44C58c)
   * Jul-13-2023 - [0x52cbE0f49CcdD4Dc6E9C13BAb024EABD2842045B](https://snowtrace.io/address/0x52cbE0f49CcdD4Dc6E9C13BAb024EABD2842045B)

</details>

### Gnosis (xDai)

#### Oracle [0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8](https://gnosisscan.io/address/0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8)

<details><summary>Supported DEXes</summary>

   * Honeyswap - [0xE93293A6088d3a8abDDf62e6CA1A085Cec97D06F](https://gnosisscan.io/address/0xE93293A6088d3a8abDDf62e6CA1A085Cec97D06F)
   * Levinswap - [0x52a8193C7f42b75F27e4ce96f8ddBA7e854453Ef](https://gnosisscan.io/address/0x52a8193C7f42b75F27e4ce96f8ddBA7e854453Ef)
   * Swapr - [0x27950ecAeBB4462e18e8041AAF6Ea13cA47Af001](https://gnosisscan.io/address/0x27950ecAeBB4462e18e8041AAF6Ea13cA47Af001)
   * SushiSwap - [0x2A45d538f460DDBEeA3a899b0674dA3DFE318faa](https://gnosisscan.io/address/0x2A45d538f460DDBEeA3a899b0674dA3DFE318faa)
   * Curve - [0x587D67870CF6e733F2Ac101eD83675d6C01Ae127](https://gnosisscan.io/address/0x587D67870CF6e733F2Ac101eD83675d6C01Ae127)
   
</details>

<details><summary>Supported wrappers</summary>

   * WXDAI - [0xB89A664FdAf504CDc7826B97Ba6e522d9b78dbE7](https://gnosisscan.io/address/0xB89A664FdAf504CDc7826B97Ba6e522d9b78dbE7)
   * AaveV3 - [0x0c8fc7a71C28c768FDC1f7d75835229beBEB1573](https://gnosisscan.io/address/0x0c8fc7a71C28c768FDC1f7d75835229beBEB1573)
   * StataTokens (AaveV3) - [0x1A75DF59f464a70Cc8f7383983852FF72e5F5167](https://gnosisscan.io/address/0x1A75DF59f464a70Cc8f7383983852FF72e5F5167)
   
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
   * Jul-13-2023 - [0x52cbE0f49CcdD4Dc6E9C13BAb024EABD2842045B](https://gnosisscan.io/address/0x52cbE0f49CcdD4Dc6E9C13BAb024EABD2842045B)

</details>

### Fantom

#### Oracle [0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8](https://ftmscan.com/address/0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8)

<details><summary>Supported DEXes</summary>

   * Solidex - [0x3Ce81621e674Db129033548CbB9FF31AEDCc1BF6](https://ftmscan.com/address/0x3Ce81621e674Db129033548CbB9FF31AEDCc1BF6)
   * SpiritSwap - [0xc197Ab9d47206dAf739a47AC75D0833fD2b0f87F](https://ftmscan.com/address/0xc197Ab9d47206dAf739a47AC75D0833fD2b0f87F)
   * Spooky - [0xE93293A6088d3a8abDDf62e6CA1A085Cec97D06F](https://ftmscan.com/address/0xE93293A6088d3a8abDDf62e6CA1A085Cec97D06F)
   * SushiSwap - [0x2A45d538f460DDBEeA3a899b0674dA3DFE318faa](https://ftmscan.com/address/0x2A45d538f460DDBEeA3a899b0674dA3DFE318faa)
   * Curve - [0x0bA0D1B119d8a8E193e2802c2C7Ef1BDfAdddc49](https://ftmscan.com/address/0x0bA0D1B119d8a8E193e2802c2C7Ef1BDfAdddc49)

</details>

<details><summary>Supported wrappers</summary>

   * WFTM - [0x046605839c01C54921f4aA1AAa245E88227707D8](https://ftmscan.com/address/0x046605839c01C54921f4aA1AAa245E88227707D8)
   * AaveV2 - [0xa0c978c28AB8aEfc95bF58e68A05ce6B9dEAc5A9](https://ftmscan.com/address/0xa0c978c28AB8aEfc95bF58e68A05ce6B9dEAc5A9)
   * AaveV3 - [0x0c8fc7a71C28c768FDC1f7d75835229beBEB1573](https://ftmscan.com/address/0x0c8fc7a71C28c768FDC1f7d75835229beBEB1573)
   * Scream - [0x7d18d5Ba1FA30Da1AD757c57eb643564CA02922D](https://ftmscan.com/address/0x7d18d5Ba1FA30Da1AD757c57eb643564CA02922D)
   
</details>

<details><summary>Supported connectors</summary>

   * NONE - [0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF](https://ftmscan.com/address/0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF)
   * FTM - [0x0000000000000000000000000000000000000000](https://ftmscan.com/address/0x0000000000000000000000000000000000000000)
   * WFTM - [0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83](https://ftmscan.com/address/0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83)

</details>

<details><summary>Prev oracle versions (legacy)</summary>

   * Mar-21-2022 - [0xE8E598A1041b6fDB13999D275a202847D9b654ca](https://ftmscan.com/address/0xE8E598A1041b6fDB13999D275a202847D9b654ca)
   * Apr-04-2023 - [0xFdCB8fA524f84081988e6065Fc8EF060f2CF0C27](https://ftmscan.com/address/0xFdCB8fA524f84081988e6065Fc8EF060f2CF0C27)
   * Jul-13-2023 - [0x52cbE0f49CcdD4Dc6E9C13BAb024EABD2842045B](https://ftmscan.com/address/0x52cbE0f49CcdD4Dc6E9C13BAb024EABD2842045B)

</details>

### Aurora

#### Oracle [0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8](https://aurorascan.dev/address/0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8)

<details><summary>Supported DEXes</summary>

   * Trisolaris - [0xD4eFb5998DFBDFB791182fb610D0061136E9DB50](https://aurorascan.dev/address/0xD4eFb5998DFBDFB791182fb610D0061136E9DB50)
   * WannaSwap - [0x7bdc6954e1c7869B4147A320d589689F628E9921](https://aurorascan.dev/address/0x7bdc6954e1c7869B4147A320d589689F628E9921)
   * NearPAD - [0x3E1Fe1Bd5a5560972bFa2D393b9aC18aF279fF56](https://aurorascan.dev/address/0x3E1Fe1Bd5a5560972bFa2D393b9aC18aF279fF56)
   * AuroraSwap - [0xd8C7661C2bA6E9732613C15780f9fBBD55d8bf9c](https://aurorascan.dev/address/0xd8C7661C2bA6E9732613C15780f9fBBD55d8bf9c)
   * Dodo - [0x0A7c4d89e1629f189Eb12dd716B178d1b90D9f66](https://aurorascan.dev/address/0x0A7c4d89e1629f189Eb12dd716B178d1b90D9f66)
   * DodoV2 - [0x03aA019F3B78110e030c34e9fA98047A1f62859A](https://aurorascan.dev/address/0x03aA019F3B78110e030c34e9fA98047A1f62859A)
   * Curve - [0x0bA0D1B119d8a8E193e2802c2C7Ef1BDfAdddc49](https://aurorascan.dev/address/0x0bA0D1B119d8a8E193e2802c2C7Ef1BDfAdddc49)

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
   * Jul-13-2023 - [0x52cbE0f49CcdD4Dc6E9C13BAb024EABD2842045B](https://aurorascan.dev/address/0x52cbE0f49CcdD4Dc6E9C13BAb024EABD2842045B)

</details>

### Klaytn

#### Oracle [0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8](https://scope.klaytn.com/account/0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8)

<details><summary>Supported DEXes</summary>

   * KlaySwap - [0xf023D71EfB08339EA28F0C186AE130c74D44C58c](https://scope.klaytn.com/account/0xf023D71EfB08339EA28F0C186AE130c74D44C58c)
   * ClaimSwap - [0xFdCB8fA524f84081988e6065Fc8EF060f2CF0C27](https://scope.klaytn.com/account/0xFdCB8fA524f84081988e6065Fc8EF060f2CF0C27)

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
   * Jul-13-2023 - [0x52cbE0f49CcdD4Dc6E9C13BAb024EABD2842045B](https://scope.klaytn.com/account/0x52cbE0f49CcdD4Dc6E9C13BAb024EABD2842045B)

</details>

### zkSync

#### Oracle [0xc9bB6e4FF7dEEa48e045CEd9C0ce016c7CFbD500](https://explorer.zksync.io/address/0xc9bB6e4FF7dEEa48e045CEd9C0ce016c7CFbD500)

<details><summary>Supported DEXes</summary>

   * MuteSwitch - [0xE0C1daF04Ca9f65c45bF67E87F6135fcf51ba5D1](https://explorer.zksync.io/address/0xE0C1daF04Ca9f65c45bF67E87F6135fcf51ba5D1)
   * Syncswap - [0x226b15358e2DF022ada190fc3Ac4a32ea26C18c8](https://explorer.zksync.io/address/0x226b15358e2DF022ada190fc3Ac4a32ea26C18c8)

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
   * Jul-12-2023 - [0xC762d56614D3411eC6fABD56cb075D904b801613](https://explorer.zksync.io/address/0xC762d56614D3411eC6fABD56cb075D904b801613)

</details>

### Base

#### Oracle [0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8](https://basescan.org/address/0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8)

<details><summary>Supported DEXes</summary>

   * BaseSwap - [0xb57CdEC62Df2AA93AC4C2449Eb50eB4d2f264f3e](https://basescan.org/address/0xb57CdEC62Df2AA93AC4C2449Eb50eB4d2f264f3e)
   * RocketSwap - [0x3EB7BFE1217b97d19e740C3587f2b12D00abc0Bc](https://basescan.org/address/0x3EB7BFE1217b97d19e740C3587f2b12D00abc0Bc)
   * SwapBased - [0xA57eE57aa7af7c43265A8376c3d54543Cc78C089](https://basescan.org/address/0xA57eE57aa7af7c43265A8376c3d54543Cc78C089)
   * DackieSwap - [0x48f0E5C5A5f5E5d49f3EaF8f5E242C7550629544](https://basescan.org/address/0x48f0E5C5A5f5E5d49f3EaF8f5E242C7550629544)
   * HorizonDex - [0xcdEee819aEf73511331522552Ca1E54e771D40ed](https://basescan.org/address/0xcdEee819aEf73511331522552Ca1E54e771D40ed)
   * SushiSwapV3 - [0xf71502f807C37A5aD9bB50aA983423907647bF96](https://basescan.org/address/0xf71502f807C37A5aD9bB50aA983423907647bF96)
   * UniswapV2 - [0x4C5B9573dE7660c097F1a21050038378CD691066](https://basescan.org/address/0x4C5B9573dE7660c097F1a21050038378CD691066)
   * UniswapV3 - [0xE85B42805e046D1933EB8e1C543C4da4E5e8fFa3](https://basescan.org/address/0xE85B42805e046D1933EB8e1C543C4da4E5e8fFa3)
   * VelocimeterV2 - [0x26daCf7E879b18FE658326ddD3ABC0D6910B3E9F](https://basescan.org/address/0x26daCf7E879b18FE658326ddD3ABC0D6910B3E9F)
   * Aerodrome - [0xFd1d18173D2f179a45Bf21F755a261AAe7C2d769](https://basescan.org/address/0xFd1d18173D2f179a45Bf21F755a261AAe7C2d769)
   
</details>

<details><summary>Supported wrappers</summary>

   * WETH - [0x3Ce81621e674Db129033548CbB9FF31AEDCc1BF6](https://basescan.org/address/0x3Ce81621e674Db129033548CbB9FF31AEDCc1BF6)
   * AaveV3 - [0x0c8fc7a71C28c768FDC1f7d75835229beBEB1573](https://basescan.org/address/0x0c8fc7a71C28c768FDC1f7d75835229beBEB1573)
   * StataTokens (AaveV3) - [0x1A75DF59f464a70Cc8f7383983852FF72e5F5167](https://basescan.org/address/0x1A75DF59f464a70Cc8f7383983852FF72e5F5167)
   * CompoundV3 - [0x3afA12cf9Ac1a96845973BD93dBEa183A94DD74F](https://basescan.org/address/0x3afA12cf9Ac1a96845973BD93dBEa183A94DD74F)

</details>

<details><summary>Supported connectors</summary>

   * NONE - [0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF](https://basescan.org/address/0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF)
   * WETH - [0x4200000000000000000000000000000000000006](https://basescan.org/address/0x4200000000000000000000000000000000000006)
   * axlUSDC - [0xEB466342C4d449BC9f53A865D5Cb90586f405215](https://basescan.org/address/0xEB466342C4d449BC9f53A865D5Cb90586f405215)
   * USDC - [0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913](https://basescan.org/address/0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913)

</details>

<details><summary>Prev oracle versions (legacy)</summary>

   * Aug-09-2023 - [0x52cbE0f49CcdD4Dc6E9C13BAb024EABD2842045B](https://basescan.org/address/0x52cbE0f49CcdD4Dc6E9C13BAb024EABD2842045B)

</details>

## Examples

* [Single token-to-ETH price usage](https://github.com/1inch-exchange/offchain-oracle/blob/master/examples/single-price.js)

* [Multiple token-to-ETH prices usage](https://github.com/1inch-exchange/offchain-oracle/blob/master/examples/multiple-prices.js)

## Oracle Deployment Guide

This section provides a comprehensive guide on deploying an oracle, including the nuances of script parameters and additional setup steps. Follow these steps to ensure accurate and reliable oracle deployment for price data retrieval.

### Step 1: Surveying DEX Liquidity

1. **Identify DEXes with Sufficient Liquidity:** Begin by surveying the network for Decentralized Exchanges (DEXes) that offer sufficient liquidity. This ensures the oracle can retrieve reliable and accurate price data.

### Step 2: Selection of DEXes

2. **Select Supported DEXes:** Choose DEXes that are supported by `SpotPriceAggregator` or are forks of supported protocols. Supported DEXes can be found in the `contracts/oracles/` directory of the project.

### Step 3: Network Configuration

3. **Configure the Network Settings:**
   - Skip this step if your network is supported. This can be checked by observing whether the network is mentioned (registered or not) during a test run, visible in the console output. This verification can be done also by reviewing the `registerAll` method in the [`Networks` class](https://github.com/1inch/solidity-utils/blob/master/hardhat-setup/networks.ts#L108-L128). If your network is listed there, it's considered supported, and no further action is required for registration in this step.
   - Update the [Hardhat settings file](https://github.com/1inch/spot-price-aggregator/blob/master/hardhat.config.js) to configure the network.
   - Utilize the `Networks` class from [solidity-utils](https://github.com/1inch/solidity-utils/blob/master/hardhat-setup/networks.ts) for network registration.
   - Example configuration snippet:
     ```javascript
     ...
     const { Networks } = require('@1inch/solidity-utils/hardhat-setup');
     const net = new Networks(true, 'mainnet', true);
     net.register(your_network_name, networkId, process.env.YOURNETWORK_RPC_URL, process.env.YOURNETWORK_PRIVATE_KEY, etherscan_network_name, process.env.YOURNETWORK_ETHERSCAN_KEY);
     const networks = net.networks;
     const etherscan = net.etherscan;
     ...
     ```

### Step 4: Environment Variables

4. **Set Environment Variables:** Define necessary environment variables in the `.env` file located at the project root. Include variables such as `YOURNETWORK_RPC_URL`, `YOURNETWORK_PRIVATE_KEY`, and `YOURNETWORK_ETHERSCAN_KEY` with appropriate values:

   - `YOURNETWORK_RPC_URL`: The RPC URL for accessing your network's node. This URL can support the HTTP header 'auth-key'. To use this header, append the header value to the URL using the `|` symbol. For example: `http://localhost:8545|HeaderValue`. This format allows you to authenticate requests to your node.

   - `YOURNETWORK_PRIVATE_KEY`: Your account's private key, which should be entered without the `0x` prefix. This key is used for deploying contracts and executing transactions on the network.

   - `YOURNETWORK_ETHERSCAN_KEY`: The API key for an Etherscan-like blockchain explorer that supports your network. This key is necessary for verifying and publishing your contract's source code. Ensure you register for an API key with a compatible explorer service for your network.

### Step 5: Deploying Oracles

5. **Deploy Oracles:**
   - Use the deploy script located at `deploy/commands/simple-deploy.js`. You can find a description of the script and how to use it in the [scripts description](https://github.com/1inch/spot-price-aggregator/blob/master/deploy/README.md).
   - Configure the `PARAMS` object for each protocol you wish to deploy an oracle for. The parameters include:
      - **contractName**: Name of the contract from the `contracts/oracles/` directory.
      - **args**: Arguments required by the contract (See contract's constructor).
      - **deploymentName**: A name for your deployment, which will be used to create a file in the `deployments/` directory.
   - Ensure the `skip` [flag](https://github.com/1inch/spot-price-aggregator/blob/master/deploy/commands/simple-deploy.js#L25) is set to `false` to proceed with deployment.
   - Example command for deployment: `yarn && yarn deploy <your_network_name>`.

### Step 6: Deploying Wrappers

6. **Deploy Wrappers:**
   - Follow similar steps as step 5 to deploy necessary wrappers and `MultiWrapper`. You can find different wrappers in the `contracts/wrappers/` directory. After `MultiWrapper` is deployed, it will be possible to edit these lists of wrappers.

### Step 7: Deploying OffchainOracle

7. **Deploy OffchainOracle:**
   - Follow similar steps as step 5 to deploy the `OffchainOracle`. Make sure to include the deployed oracles (from step 5), `MultiWrapper` with wrappers (from step 6) and specifying the tokens you wish to use as connectors for price discovery. After `OffchainOracle` is deployed, it will be possible to edit these lists of oracles and connectors.

## Support and Assistance

For any questions or further assistance, don't hesitate to reach out (for example via issue). This guide aims to facilitate your oracle deployment process, ensuring a smooth and reliable setup.
