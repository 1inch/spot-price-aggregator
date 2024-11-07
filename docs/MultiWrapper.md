
## MultiWrapper

Сontract allows for the management of multiple `IWrapper` contracts that can be used to wrap tokens in OffchainOracle's calculations.
Wrappers are contracts that enable the conversion of tokens from one protocol to another.
The contract provides functions to add and remove wrappers, as well as get information about the wrapped tokens and their conversion rates.

### Functions list
- [constructor(existingWrappers, owner_) public](#constructor)
- [wrappers() external](#wrappers)
- [addWrapper(wrapper) external](#addwrapper)
- [removeWrapper(wrapper) external](#removewrapper)
- [getWrappedTokens(token) external](#getwrappedtokens)

### Events list
- [WrapperAdded(connector) ](#wrapperadded)
- [WrapperRemoved(connector) ](#wrapperremoved)

### Errors list
- [WrapperAlreadyAdded() ](#wrapperalreadyadded)
- [UnknownWrapper() ](#unknownwrapper)

### Functions
### constructor

```solidity
constructor(contract IWrapper[] existingWrappers, address owner_) public
```
Adds the provided wrappers to the contract.

_Initializes the MultiWrapper with an array of existing `IWrapper` contracts._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| existingWrappers | contract IWrapper[] | Initial wrappers to be added. |
| owner_ | address |  |

### wrappers

```solidity
function wrappers() external view returns (contract IWrapper[] allWrappers)
```
Returns all wrappers currently added to the contract.

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
allWrappers | contract IWrapper[] | Array of wrapper contracts. |

### addWrapper

```solidity
function addWrapper(contract IWrapper wrapper) external
```
Adds a distinct wrapper contract that cannot be duplicated. Only the owner can add a wrapper.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| wrapper | contract IWrapper | The address of the wrapper to be added. |

### removeWrapper

```solidity
function removeWrapper(contract IWrapper wrapper) external
```
Removes a specified wrapper contract. Only the owner can remove a wrapper.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| wrapper | contract IWrapper | The address of the wrapper to be removed. |

### getWrappedTokens

```solidity
function getWrappedTokens(contract IERC20 token) external view returns (contract IERC20[] wrappedTokens, uint256[] rates)
```
Retrieves the wrapped tokens and their conversion rates for a given token.

_Iterates over the wrappers to determine the wrapped tokens and their conversion rates._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| token | contract IERC20 | The token for which to retrieve the wrapped tokens and conversion rates. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
wrappedTokens | contract IERC20[] | Tokens obtainable by wrapping the input token, including the input token and a rate of 1e18 for it. |
rates | uint256[] | Conversion rates for the wrapped tokens. |

### Events
### WrapperAdded

```solidity
event WrapperAdded(contract IWrapper connector)
```

### WrapperRemoved

```solidity
event WrapperRemoved(contract IWrapper connector)
```

### Errors
### WrapperAlreadyAdded

```solidity
error WrapperAlreadyAdded()
```

### UnknownWrapper

```solidity
error UnknownWrapper()
```

