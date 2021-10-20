# UniswapV3Oracle





## Functions
### constructor
```solidity
function constructor(
  bytes32 _poolInitCodeHash
) public
```


#### Parameters:
| Name | Type | Description                                                          |
| :--- | :--- | :------------------------------------------------------------------- |
|`_poolInitCodeHash` | bytes32 | 


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


### _getRate
```solidity
function _getRate(
  contract IERC20 srcToken,
  contract IERC20 dstToken,
  uint24 fee
) internal returns (uint256 rate, uint256 srcBalance, uint256 dstBalance)
```


#### Parameters:
| Name | Type | Description                                                          |
| :--- | :--- | :------------------------------------------------------------------- |
|`srcToken` | contract IERC20 | 
|`dstToken` | contract IERC20 | 
|`fee` | uint24 | 


