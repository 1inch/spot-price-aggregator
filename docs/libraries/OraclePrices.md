
## OraclePrices

A library that provides functionalities for processing and analyzing token rate and weight data provided by an oracle.
        The library is used when an oracle uses multiple pools to determine a token's price.
        It allows to filter out pools with low weight and significantly incorrect price, which could distort the weighted price.
        The level of low-weight pool filtering can be managed using the thresholdFilter parameter.

### Types list
- [OraclePrice](#oracleprice)
- [Data](#data)

### Functions list
- [init(maxArrLength) internal](#init)
- [append(data, oraclePrice) internal](#append)
- [getRateAndWeight(data, thresholdFilter) internal](#getrateandweight)
- [getRateAndWeightWithSafeMath(data, thresholdFilter) internal](#getrateandweightwithsafemath)

### Types
### OraclePrice

This structure encapsulates the rate and weight information for tokens as provided by an oracle

_An array of OraclePrice structures can be used to represent oracle data for multiple pools_

```solidity
struct OraclePrice {
  uint256 rate;
  uint256 weight;
}
```
### Data

This structure encapsulates information about a list of oracles prices and weights

_The structure is initialized with a maximum possible length by the `init` function_

```solidity
struct Data {
  uint256 maxOracleWeight;
  uint256 size;
  struct OraclePrices.OraclePrice[] oraclePrices;
}
```

### Functions
### init

```solidity
function init(uint256 maxArrLength) internal pure returns (struct OraclePrices.Data data)
```
Initializes an array of OraclePrices with a given maximum length and returns it wrapped inside a Data struct

_Uses inline assembly for memory allocation to avoid array zeroing and extra array copy to struct_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| maxArrLength | uint256 | The maximum length of the oraclePrices array |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
data | struct OraclePrices.Data | Returns an instance of Data struct containing an OraclePrice array with a specified maximum length |

### append

```solidity
function append(struct OraclePrices.Data data, struct OraclePrices.OraclePrice oraclePrice) internal pure returns (bool isAppended)
```
Appends an OraclePrice to the oraclePrices array in the provided Data struct if the OraclePrice has a non-zero weight

_If the weight of the OraclePrice is greater than the current maxOracleWeight, the maxOracleWeight is updated. The size (number of meaningful elements) of the array is incremented after appending the OraclePrice._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| data | struct OraclePrices.Data | The Data struct that contains the oraclePrices array, maxOracleWeight, and the current size |
| oraclePrice | struct OraclePrices.OraclePrice | The OraclePrice to be appended to the oraclePrices array |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
isAppended | bool | A flag indicating whether the oraclePrice was appended or not |

### getRateAndWeight

```solidity
function getRateAndWeight(struct OraclePrices.Data data, uint256 thresholdFilter) internal pure returns (uint256 weightedRate, uint256 totalWeight)
```
Calculates the weighted rate from the oracle prices data using a threshold filter

_Shrinks the `oraclePrices` array to remove any unused space, though it's unclear how this optimizes the code, but it is. Then calculates the weighted rate
     considering only the oracle prices whose weight is above the threshold which is percent from max weight_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| data | struct OraclePrices.Data | The data structure containing oracle prices, the maximum oracle weight and the size of the used oracle prices array |
| thresholdFilter | uint256 | The threshold to filter oracle prices based on their weight |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
weightedRate | uint256 | The calculated weighted rate |
totalWeight | uint256 | The total weight of the oracle prices that passed the threshold |

### getRateAndWeightWithSafeMath

```solidity
function getRateAndWeightWithSafeMath(struct OraclePrices.Data data, uint256 thresholdFilter) internal pure returns (uint256 weightedRate, uint256 totalWeight)
```
See `getRateAndWeight`. It uses SafeMath to prevent overflows.

