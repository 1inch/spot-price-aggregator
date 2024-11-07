
## ILendingPoolV2

### Types list
- [ReserveConfigurationMap](#reserveconfigurationmap)
- [ReserveData](#reservedata)

### Functions list
- [getReserveData(asset) external](#getreservedata)

### Types
### ReserveConfigurationMap

```solidity
struct ReserveConfigurationMap {
  uint256 data;
}
```
### ReserveData

```solidity
struct ReserveData {
  struct ILendingPoolV2.ReserveConfigurationMap configuration;
  uint128 liquidityIndex;
  uint128 variableBorrowIndex;
  uint128 currentLiquidityRate;
  uint128 currentVariableBorrowRate;
  uint128 currentStableBorrowRate;
  uint40 lastUpdateTimestamp;
  address aTokenAddress;
  address stableDebtTokenAddress;
  address variableDebtTokenAddress;
  address interestRateStrategyAddress;
  uint8 id;
}
```

### Functions
### getReserveData

```solidity
function getReserveData(address asset) external view returns (struct ILendingPoolV2.ReserveData)
```

