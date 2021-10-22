# OracleBase





## Functions
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


### _getBalances
```solidity
function _getBalances(
  contract IERC20 srcToken,
  contract IERC20 dstToken
) internal returns (uint256 srcBalance, uint256 dstBalance)
```


#### Parameters:
| Name | Type | Description                                                          |
| :--- | :--- | :------------------------------------------------------------------- |
|`srcToken` | contract IERC20 | 
|`dstToken` | contract IERC20 | 


