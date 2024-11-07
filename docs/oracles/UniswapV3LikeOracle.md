
## UniswapV3LikeOracle

### Functions list
- [constructor(_factory, _initcodeHash, _fees) public](#constructor)
- [getRate(srcToken, dstToken, connector, thresholdFilter) external](#getrate)
- [_getRate(srcToken, dstToken, fee) internal](#_getrate)
- [_getPool(token0, token1, fee) internal](#_getpool)
- [_currentState(pool) internal](#_currentstate)

### Functions
### constructor

```solidity
constructor(address _factory, bytes32 _initcodeHash, uint24[] _fees) public
```

### getRate

```solidity
function getRate(contract IERC20 srcToken, contract IERC20 dstToken, contract IERC20 connector, uint256 thresholdFilter) external view returns (uint256 rate, uint256 weight)
```

### _getRate

```solidity
function _getRate(contract IERC20 srcToken, contract IERC20 dstToken, uint24 fee) internal view returns (uint256 rate, uint256 liquidity)
```

### _getPool

```solidity
function _getPool(address token0, address token1, uint24 fee) internal view virtual returns (address)
```

### _currentState

```solidity
function _currentState(address pool) internal view virtual returns (uint256 sqrtPriceX96, int24 tick)
```

