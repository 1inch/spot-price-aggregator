
## ICurveMetaregistry

### Functions list
- [find_pools_for_coins(srcToken, dstToken) external](#find_pools_for_coins)
- [get_coin_indices(_pool, _from, _to) external](#get_coin_indices)
- [get_underlying_balances(_pool) external](#get_underlying_balances)

### Functions
### find_pools_for_coins

```solidity
function find_pools_for_coins(address srcToken, address dstToken) external view returns (address[])
```

### get_coin_indices

```solidity
function get_coin_indices(address _pool, address _from, address _to) external view returns (int128, int128, bool)
```

### get_underlying_balances

```solidity
function get_underlying_balances(address _pool) external view returns (uint256[8])
```

