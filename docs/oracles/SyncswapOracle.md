
## ISyncswapFactory

### Functions list
- [getPool(tokenA, tokenB) external](#getpool)

### Functions
### getPool

```solidity
function getPool(address tokenA, address tokenB) external view returns (address pool)
```

## ISyncswapPool

### Functions list
- [getReserves() external](#getreserves)

### Functions
### getReserves

```solidity
function getReserves() external view returns (uint256, uint256)
```

## SyncswapOracle

### Functions list
- [constructor(_factory) public](#constructor)
- [_getBalances(srcToken, dstToken) internal](#_getbalances)

### Functions
### constructor

```solidity
constructor(contract ISyncswapFactory _factory) public
```

### _getBalances

```solidity
function _getBalances(contract IERC20 srcToken, contract IERC20 dstToken) internal view returns (uint256 srcBalance, uint256 dstBalance)
```

