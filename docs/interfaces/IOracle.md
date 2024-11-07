
## IOracle

### Functions list
- [getRate(srcToken, dstToken, connector, thresholdFilter) external](#getrate)

### Errors list
- [ConnectorShouldBeNone() ](#connectorshouldbenone)
- [PoolNotFound() ](#poolnotfound)
- [PoolWithConnectorNotFound() ](#poolwithconnectornotfound)

### Functions
### getRate

```solidity
function getRate(contract IERC20 srcToken, contract IERC20 dstToken, contract IERC20 connector, uint256 thresholdFilter) external view returns (uint256 rate, uint256 weight)
```

### Errors
### ConnectorShouldBeNone

```solidity
error ConnectorShouldBeNone()
```

### PoolNotFound

```solidity
error PoolNotFound()
```

### PoolWithConnectorNotFound

```solidity
error PoolWithConnectorNotFound()
```

