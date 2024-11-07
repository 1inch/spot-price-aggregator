
## OracleBase

### Functions list
- [getRate(srcToken, dstToken, connector, ) external](#getrate)
- [_getBalances(srcToken, dstToken) internal](#_getbalances)

### Functions
### getRate

```solidity
function getRate(contract IERC20 srcToken, contract IERC20 dstToken, contract IERC20 connector, uint256) external view returns (uint256 rate, uint256 weight)
```

### _getBalances

```solidity
function _getBalances(contract IERC20 srcToken, contract IERC20 dstToken) internal view virtual returns (uint256 srcBalance, uint256 dstBalance)
```

