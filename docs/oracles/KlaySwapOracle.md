
## IKlaySwapFactory

### Functions list
- [tokenToPool(tokenA, tokenB) external](#tokentopool)

### Functions
### tokenToPool

```solidity
function tokenToPool(contract IERC20 tokenA, contract IERC20 tokenB) external view returns (address pool)
```

## IKlaySwapStorage

### Functions list
- [getReserves(pool) external](#getreserves)

### Functions
### getReserves

```solidity
function getReserves(address pool) external view returns (uint256 reserve0, uint256 reserve1, uint256 timestamp)
```

## KlaySwapOracle

### Functions list
- [constructor(_factory, _storage) public](#constructor)
- [_getBalances(srcToken, dstToken) internal](#_getbalances)

### Functions
### constructor

```solidity
constructor(contract IKlaySwapFactory _factory, contract IKlaySwapStorage _storage) public
```

### _getBalances

```solidity
function _getBalances(contract IERC20 srcToken, contract IERC20 dstToken) internal view returns (uint256 srcBalance, uint256 dstBalance)
```

