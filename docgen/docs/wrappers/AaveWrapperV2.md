# AaveWrapperV2





## Functions
### constructor
```solidity
function constructor(
  contract ILendingPoolV2 lendingPool
) public
```


#### Parameters:
| Name | Type | Description                                                          |
| :--- | :--- | :------------------------------------------------------------------- |
|`lendingPool` | contract ILendingPoolV2 | 


### addMarkets
```solidity
function addMarkets(
  contract IERC20[] tokens
) external
```


#### Parameters:
| Name | Type | Description                                                          |
| :--- | :--- | :------------------------------------------------------------------- |
|`tokens` | contract IERC20[] | 


### removeMarkets
```solidity
function removeMarkets(
  contract IERC20[] tokens
) external
```


#### Parameters:
| Name | Type | Description                                                          |
| :--- | :--- | :------------------------------------------------------------------- |
|`tokens` | contract IERC20[] | 


### wrap
```solidity
function wrap(
  contract IERC20 token
) external returns (contract IERC20 wrappedToken, uint256 rate)
```


#### Parameters:
| Name | Type | Description                                                          |
| :--- | :--- | :------------------------------------------------------------------- |
|`token` | contract IERC20 | 


