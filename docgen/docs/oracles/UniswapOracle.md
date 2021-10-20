# UniswapOracle





## Functions
### constructor
```solidity
function constructor(
  contract IUniswapFactory factory
) public
```


#### Parameters:
| Name | Type | Description                                                          |
| :--- | :--- | :------------------------------------------------------------------- |
|`factory` | contract IUniswapFactory | 


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


