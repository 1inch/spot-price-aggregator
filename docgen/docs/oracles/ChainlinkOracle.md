# ChainlinkOracle





## Functions
### constructor
```solidity
function constructor(
  contract IChainlink _chainlink
) public
```


#### Parameters:
| Name | Type | Description                                                          |
| :--- | :--- | :------------------------------------------------------------------- |
|`_chainlink` | contract IChainlink | 


### getRate
```solidity
function getRate(
  contract IERC20 srcToken,
  contract IERC20 dstToken,
  contract IERC20 connector
) external returns (uint256 rate, uint256 weight)
```


#### Parameters:
| Name | Type | Description                                                          |
| :--- | :--- | :------------------------------------------------------------------- |
|`srcToken` | contract IERC20 | 
|`dstToken` | contract IERC20 | 
|`connector` | contract IERC20 | 


