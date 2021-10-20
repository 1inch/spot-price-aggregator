# IChainlink





## Functions
### latestRoundData
```solidity
function latestRoundData(
  contract IERC20 base,
  address quote
) external returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)
```
get data about the latest round. Consumers are encouraged to check
that they're receiving fresh data by inspecting the updatedAt and
answeredInRound return values.
Note that different underlying implementations of AggregatorV3Interface
have slightly different semantics for some of the return values. Consumers
should determine what implementations they expect to receive
data from and validate that they can properly handle return data from all
of them.

Note that answer and updatedAt may change between queries.
#### Parameters:
| Name | Type | Description                                                          |
| :--- | :--- | :------------------------------------------------------------------- |
|`base` | contract IERC20 | base asset address  
|`quote` | address | quote asset address  

#### Return Values:
| Name                           | Type          | Description                                                                  |
| :----------------------------- | :------------ | :--------------------------------------------------------------------------- |
|`roundId`| contract IERC20 | is the round ID from the aggregator for which the data was retrieved combined with a phase to ensure that round IDs get larger as time moves forward. |`answer`| address | is the answer for the given round |`startedAt`|  | is the timestamp when the round was started. (Only some AggregatorV3Interface implementations return meaningful values) |`updatedAt`|  | is the timestamp when the round last was updated (i.e. answer was last computed) |`answeredInRound`|  | is the round ID of the round in which the answer was computed. (Only some AggregatorV3Interface implementations return meaningful values) 
