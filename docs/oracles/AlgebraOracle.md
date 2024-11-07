
## AlgebraOracle

### Functions list
- [constructor(_factory, _initcodeHash) public](#constructor)
- [_getPool(token0, token1, ) internal](#_getpool)
- [_currentState(pool) internal](#_currentstate)

### Functions
### constructor

```solidity
constructor(address _factory, bytes32 _initcodeHash) public
```

### _getPool

```solidity
function _getPool(address token0, address token1, uint24) internal view returns (address)
```

### _currentState

```solidity
function _currentState(address pool) internal view returns (uint256 sqrtPriceX96, int24 tick)
```

