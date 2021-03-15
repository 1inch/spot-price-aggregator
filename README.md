# Offchain Price Oracle

Price oracle that shows liquidity-weighted average of spot prices of multiple dexes. The oracle can be easily manipulated inside transaction so it should ONLY be used offchain. See Examples section below.

## Wrappers

Price Oracle handles wrapped tokens like WETH, cDAI, aDAI, etc. using custom wrapper smart contracts that wrap/unwrap tokens with latest wrapping exchange rate.

## Connectors

As some tokens do not have direct liquidity pairs oracle uses connector tokes to find prices for such tokens.

## Supported Deployments

### Ethereum Mainnet

#### Oracle [0x080ab73787a8b13ec7f40bd7d00d6cc07f9b24d0](https://etherscan.io/address/0x080ab73787a8b13ec7f40bd7d00d6cc07f9b24d0)

#### Supported DEXes

* Mooniswap
* 1inch Liquidity Protocol V1
* 1inch Liquidity Protocol V1.1
* Uniswap V1
* Uniswap V2
* Sushiswap
* Equalizer.fi

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

#### Oracle [0xe26A18b00E4827eD86bc136B2c1e95D5ae115edD](https://bscscan.com/address/0xe26A18b00E4827eD86bc136B2c1e95D5ae115edD)

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

## Examples

* [Single token-to-ETH price usage](https://github.com/1inch-exchange/offchain-oracle/blob/master/examples/single-price.js)

* [Multiple token-to-ETH prices usage](https://github.com/1inch-exchange/offchain-oracle/blob/master/examples/multiple-prices.js)
