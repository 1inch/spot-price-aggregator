
## UniswapOracle

### Functions list
- [constructor(_factory) public](#constructor)
- [_getBalances(srcToken, dstToken) internal](#_getbalances)

### Errors list
- [UnsupportedTokens() ](#unsupportedtokens)

### Functions
### constructor

```solidity
constructor(contract IUniswapFactory _factory) public
```

### _getBalances

```solidity
function _getBalances(contract IERC20 srcToken, contract IERC20 dstToken) internal view returns (uint256 srcBalance, uint256 dstBalance)
```

### Errors
### UnsupportedTokens

```solidity
error UnsupportedTokens()
```

