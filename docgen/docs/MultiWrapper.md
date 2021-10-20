# MultiWrapper





## Functions
### constructor
```solidity
function constructor(
  contract IWrapper[] existingWrappers
) public
```


#### Parameters:
| Name | Type | Description                                                          |
| :--- | :--- | :------------------------------------------------------------------- |
|`existingWrappers` | contract IWrapper[] | 


### wrappers
```solidity
function wrappers(
) external returns (contract IWrapper[] allWrappers)
```




### addWrapper
```solidity
function addWrapper(
  contract IWrapper wrapper
) external
```


#### Parameters:
| Name | Type | Description                                                          |
| :--- | :--- | :------------------------------------------------------------------- |
|`wrapper` | contract IWrapper | 


### removeWrapper
```solidity
function removeWrapper(
  contract IWrapper wrapper
) external
```


#### Parameters:
| Name | Type | Description                                                          |
| :--- | :--- | :------------------------------------------------------------------- |
|`wrapper` | contract IWrapper | 


### getWrappedTokens
```solidity
function getWrappedTokens(
  contract IERC20 token
) external returns (contract IERC20[] wrappedTokens, uint256[] rates)
```


#### Parameters:
| Name | Type | Description                                                          |
| :--- | :--- | :------------------------------------------------------------------- |
|`token` | contract IERC20 | 


## Events
### WrapperAdded
```solidity
event WrapperAdded(
  contract IWrapper connector
)
```


#### Parameters:
| Name | Type | Description                                                          |
| :--- | :--- | :------------------------------------------------------------------- |
|`connector` | contract IWrapper | 

### WrapperRemoved
```solidity
event WrapperRemoved(
  contract IWrapper connector
)
```


#### Parameters:
| Name | Type | Description                                                          |
| :--- | :--- | :------------------------------------------------------------------- |
|`connector` | contract IWrapper | 

