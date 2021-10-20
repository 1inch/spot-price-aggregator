# OffchainOracle





## Functions
### constructor
```solidity
function constructor(
  contract MultiWrapper _multiWrapper,
  contract IOracle[] existingOracles,
  enum OffchainOracle.OracleType[] oracleTypes,
  contract IERC20[] existingConnectors,
  contract IERC20 wBase
) public
```


#### Parameters:
| Name | Type | Description                                                          |
| :--- | :--- | :------------------------------------------------------------------- |
|`_multiWrapper` | contract MultiWrapper | 
|`existingOracles` | contract IOracle[] | 
|`oracleTypes` | enum OffchainOracle.OracleType[] | 
|`existingConnectors` | contract IERC20[] | 
|`wBase` | contract IERC20 | 


### oracles
```solidity
function oracles(
) public returns (contract IOracle[] allOracles, enum OffchainOracle.OracleType[] oracleTypes)
```




### connectors
```solidity
function connectors(
) external returns (contract IERC20[] allConnectors)
```




### setMultiWrapper
```solidity
function setMultiWrapper(
  contract MultiWrapper _multiWrapper
) external
```


#### Parameters:
| Name | Type | Description                                                          |
| :--- | :--- | :------------------------------------------------------------------- |
|`_multiWrapper` | contract MultiWrapper | 


### addOracle
```solidity
function addOracle(
  contract IOracle oracle,
  enum OffchainOracle.OracleType oracleKind
) external
```


#### Parameters:
| Name | Type | Description                                                          |
| :--- | :--- | :------------------------------------------------------------------- |
|`oracle` | contract IOracle | 
|`oracleKind` | enum OffchainOracle.OracleType | 


### removeOracle
```solidity
function removeOracle(
  contract IOracle oracle,
  enum OffchainOracle.OracleType oracleKind
) external
```


#### Parameters:
| Name | Type | Description                                                          |
| :--- | :--- | :------------------------------------------------------------------- |
|`oracle` | contract IOracle | 
|`oracleKind` | enum OffchainOracle.OracleType | 


### addConnector
```solidity
function addConnector(
  contract IERC20 connector
) external
```


#### Parameters:
| Name | Type | Description                                                          |
| :--- | :--- | :------------------------------------------------------------------- |
|`connector` | contract IERC20 | 


### removeConnector
```solidity
function removeConnector(
  contract IERC20 connector
) external
```


#### Parameters:
| Name | Type | Description                                                          |
| :--- | :--- | :------------------------------------------------------------------- |
|`connector` | contract IERC20 | 


### getRate
```solidity
function getRate(
  contract IERC20 srcToken,
  contract IERC20 dstToken,
  bool useWrappers
) external returns (uint256 weightedRate)
```


#### Parameters:
| Name | Type | Description                                                          |
| :--- | :--- | :------------------------------------------------------------------- |
|`srcToken` | contract IERC20 | 
|`dstToken` | contract IERC20 | 
|`useWrappers` | bool | 


### getRateToEth
```solidity
function getRateToEth(
  contract IERC20 srcToken,
  bool useSrcWrappers
) external returns (uint256 weightedRate)
```

Same as `getRate` but checks against `ETH` and `WETH` only
#### Parameters:
| Name | Type | Description                                                          |
| :--- | :--- | :------------------------------------------------------------------- |
|`srcToken` | contract IERC20 | 
|`useSrcWrappers` | bool | 


### _getWrappedTokens
```solidity
function _getWrappedTokens(
  contract IERC20 token,
  bool useWrappers
) internal returns (contract IERC20[] wrappedTokens, uint256[] rates)
```


#### Parameters:
| Name | Type | Description                                                          |
| :--- | :--- | :------------------------------------------------------------------- |
|`token` | contract IERC20 | 
|`useWrappers` | bool | 


## Events
### OracleAdded
```solidity
event OracleAdded(
  contract IOracle oracle,
  enum OffchainOracle.OracleType oracleType
)
```


#### Parameters:
| Name | Type | Description                                                          |
| :--- | :--- | :------------------------------------------------------------------- |
|`oracle` | contract IOracle | 
|`oracleType` | enum OffchainOracle.OracleType | 

### OracleRemoved
```solidity
event OracleRemoved(
  contract IOracle oracle,
  enum OffchainOracle.OracleType oracleType
)
```


#### Parameters:
| Name | Type | Description                                                          |
| :--- | :--- | :------------------------------------------------------------------- |
|`oracle` | contract IOracle | 
|`oracleType` | enum OffchainOracle.OracleType | 

### ConnectorAdded
```solidity
event ConnectorAdded(
  contract IERC20 connector
)
```


#### Parameters:
| Name | Type | Description                                                          |
| :--- | :--- | :------------------------------------------------------------------- |
|`connector` | contract IERC20 | 

### ConnectorRemoved
```solidity
event ConnectorRemoved(
  contract IERC20 connector
)
```


#### Parameters:
| Name | Type | Description                                                          |
| :--- | :--- | :------------------------------------------------------------------- |
|`connector` | contract IERC20 | 

### MultiWrapperUpdated
```solidity
event MultiWrapperUpdated(
  contract MultiWrapper multiWrapper
)
```


#### Parameters:
| Name | Type | Description                                                          |
| :--- | :--- | :------------------------------------------------------------------- |
|`multiWrapper` | contract MultiWrapper | 

