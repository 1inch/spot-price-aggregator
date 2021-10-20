# UniswapV2LikeOracle





## Functions
### constructor
```solidity
function constructor(
  address _factory,
  bytes32 _initcodeHash
) public
```


#### Parameters:
| Name | Type | Description                                                          |
| :--- | :--- | :------------------------------------------------------------------- |
|`_factory` | address | 
|`_initcodeHash` | bytes32 | 


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


