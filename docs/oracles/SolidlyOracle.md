
## SolidlyOracle

### Functions list
- [constructor(_factory, _initcodeHash) public](#constructor)
- [getRate(srcToken, dstToken, connector, thresholdFilter) external](#getrate)
- [_getWeightedRate(srcToken, dstToken, srcDecimals, dstDecimals, thresholdFilter) internal](#_getweightedrate)
- [_getY(x0, xy, y0) internal](#_gety)
- [_f(x0, y) internal](#_f)
- [_d(x0, y) internal](#_d)
- [_pairFor(tokenA, tokenB, stable) internal](#_pairfor)
- [_getBalances(srcToken, dstToken, stable) internal](#_getbalances)

### Functions
### constructor

```solidity
constructor(address _factory, bytes32 _initcodeHash) public
```

### getRate

```solidity
function getRate(contract IERC20 srcToken, contract IERC20 dstToken, contract IERC20 connector, uint256 thresholdFilter) external view returns (uint256 rate, uint256 weight)
```

### _getWeightedRate

```solidity
function _getWeightedRate(contract IERC20 srcToken, contract IERC20 dstToken, uint256 srcDecimals, uint256 dstDecimals, uint256 thresholdFilter) internal view returns (uint256 rate, uint256 weight)
```

### _getY

```solidity
function _getY(uint256 x0, uint256 xy, uint256 y0) internal pure returns (uint256 y, bool error)
```

### _f

```solidity
function _f(uint256 x0, uint256 y) internal pure returns (uint256)
```

### _d

```solidity
function _d(uint256 x0, uint256 y) internal pure returns (uint256)
```

### _pairFor

```solidity
function _pairFor(contract IERC20 tokenA, contract IERC20 tokenB, bool stable) internal view virtual returns (address pair)
```

### _getBalances

```solidity
function _getBalances(contract IERC20 srcToken, contract IERC20 dstToken, bool stable) internal view returns (uint256 srcBalance, uint256 dstBalance)
```

