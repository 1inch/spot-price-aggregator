# CompoundLikeWrapper





## Functions
### constructor
```solidity
function constructor(
  contract IComptroller comptroller,
  contract IERC20 cBase
) public
```


#### Parameters:
| Name | Type | Description                                                          |
| :--- | :--- | :------------------------------------------------------------------- |
|`comptroller` | contract IComptroller | 
|`cBase` | contract IERC20 | 


### addMarkets
```solidity
function addMarkets(
  contract ICToken[] markets
) external
```


#### Parameters:
| Name | Type | Description                                                          |
| :--- | :--- | :------------------------------------------------------------------- |
|`markets` | contract ICToken[] | 


### removeMarkets
```solidity
function removeMarkets(
  contract ICToken[] markets
) external
```


#### Parameters:
| Name | Type | Description                                                          |
| :--- | :--- | :------------------------------------------------------------------- |
|`markets` | contract ICToken[] | 


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


