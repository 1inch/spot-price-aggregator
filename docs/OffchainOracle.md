
## OffchainOracle

### Types list
- [OracleType](#oracletype)
- [GetRateImplParams](#getrateimplparams)

### Functions list
- [constructor(_multiWrapper, existingOracles, oracleTypes, existingConnectors, wBase, owner_) public](#constructor)
- [oracles() public](#oracles)
- [connectors() external](#connectors)
- [setMultiWrapper(_multiWrapper) external](#setmultiwrapper)
- [addOracle(oracle, oracleKind) external](#addoracle)
- [removeOracle(oracle, oracleKind) external](#removeoracle)
- [addConnector(connector) external](#addconnector)
- [removeConnector(connector) external](#removeconnector)
- [getRate(srcToken, dstToken, useWrappers) external](#getrate)
- [getRateWithThreshold(srcToken, dstToken, useWrappers, thresholdFilter) external](#getratewiththreshold)
- [getRateWithCustomConnectors(srcToken, dstToken, useWrappers, customConnectors, thresholdFilter) public](#getratewithcustomconnectors)
- [getRatesAndWeightsWithCustomConnectors(srcToken, dstToken, useWrappers, customConnectors, thresholdFilter) public](#getratesandweightswithcustomconnectors)
- [getRateToEth(srcToken, useSrcWrappers) external](#getratetoeth)
- [getRateToEthWithThreshold(srcToken, useSrcWrappers, thresholdFilter) external](#getratetoethwiththreshold)
- [getRateToEthWithCustomConnectors(srcToken, useSrcWrappers, customConnectors, thresholdFilter) public](#getratetoethwithcustomconnectors)
- [getRatesAndWeightsToEthWithCustomConnectors(srcToken, useSrcWrappers, customConnectors, thresholdFilter) public](#getratesandweightstoethwithcustomconnectors)
- [_getWrappedTokens(token, useWrappers) internal](#_getwrappedtokens)
- [_getAllConnectors(customConnectors) internal](#_getallconnectors)

### Events list
- [OracleAdded(oracle, oracleType) ](#oracleadded)
- [OracleRemoved(oracle, oracleType) ](#oracleremoved)
- [ConnectorAdded(connector) ](#connectoradded)
- [ConnectorRemoved(connector) ](#connectorremoved)
- [MultiWrapperUpdated(multiWrapper) ](#multiwrapperupdated)

### Errors list
- [ArraysLengthMismatch() ](#arrayslengthmismatch)
- [OracleAlreadyAdded() ](#oraclealreadyadded)
- [ConnectorAlreadyAdded() ](#connectoralreadyadded)
- [InvalidOracleTokenKind() ](#invalidoracletokenkind)
- [UnknownOracle() ](#unknownoracle)
- [UnknownConnector() ](#unknownconnector)
- [SameTokens() ](#sametokens)
- [TooBigThreshold() ](#toobigthreshold)

### Types
### OracleType

```solidity
enum OracleType {
  WETH,
  ETH,
  WETH_ETH
}
```
### GetRateImplParams

```solidity
struct GetRateImplParams {
  contract IOracle oracle;
  contract IERC20 srcToken;
  uint256 srcTokenRate;
  contract IERC20 dstToken;
  uint256 dstTokenRate;
  contract IERC20 connector;
  uint256 thresholdFilter;
}
```

### Functions
### constructor

```solidity
constructor(contract MultiWrapper _multiWrapper, contract IOracle[] existingOracles, enum OffchainOracle.OracleType[] oracleTypes, contract IERC20[] existingConnectors, contract IERC20 wBase, address owner_) public
```

### oracles

```solidity
function oracles() public view returns (contract IOracle[] allOracles, enum OffchainOracle.OracleType[] oracleTypes)
```
Returns all registered oracles along with their corresponding oracle types.

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
allOracles | contract IOracle[] | An array of all registered oracles |
oracleTypes | enum OffchainOracle.OracleType[] | An array of the corresponding types for each oracle |

### connectors

```solidity
function connectors() external view returns (contract IERC20[] allConnectors)
```
Returns an array of all registered connectors.

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
allConnectors | contract IERC20[] | An array of all registered connectors |

### setMultiWrapper

```solidity
function setMultiWrapper(contract MultiWrapper _multiWrapper) external
```
Sets the MultiWrapper contract address.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _multiWrapper | contract MultiWrapper | The address of the MultiWrapper contract |

### addOracle

```solidity
function addOracle(contract IOracle oracle, enum OffchainOracle.OracleType oracleKind) external
```
Adds a new oracle to the registry with the given oracle type.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| oracle | contract IOracle | The address of the new oracle to add |
| oracleKind | enum OffchainOracle.OracleType | The type of the new oracle |

### removeOracle

```solidity
function removeOracle(contract IOracle oracle, enum OffchainOracle.OracleType oracleKind) external
```
Removes an oracle from the registry with the given oracle type.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| oracle | contract IOracle | The address of the oracle to remove |
| oracleKind | enum OffchainOracle.OracleType | The type of the oracle to remove |

### addConnector

```solidity
function addConnector(contract IERC20 connector) external
```
Adds a new connector to the registry.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| connector | contract IERC20 | The address of the new connector to add |

### removeConnector

```solidity
function removeConnector(contract IERC20 connector) external
```
Removes a connector from the registry.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| connector | contract IERC20 | The address of the connector to remove |

### getRate

```solidity
function getRate(contract IERC20 srcToken, contract IERC20 dstToken, bool useWrappers) external view returns (uint256 weightedRate)
```
WARNING!
   Usage of the dex oracle on chain is highly discouraged!
   getRate function can be easily manipulated inside transaction!
Returns the weighted rate between two tokens using default connectors, with the option to filter out rates below a certain threshold.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| srcToken | contract IERC20 | The source token |
| dstToken | contract IERC20 | The destination token |
| useWrappers | bool | Boolean flag to use or not use token wrappers |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
weightedRate | uint256 | weighted rate between the two tokens |

### getRateWithThreshold

```solidity
function getRateWithThreshold(contract IERC20 srcToken, contract IERC20 dstToken, bool useWrappers, uint256 thresholdFilter) external view returns (uint256 weightedRate)
```
WARNING!
   Usage of the dex oracle on chain is highly discouraged!
   getRate function can be easily manipulated inside transaction!
Returns the weighted rate between two tokens using default connectors, with the option to filter out rates below a certain threshold.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| srcToken | contract IERC20 | The source token |
| dstToken | contract IERC20 | The destination token |
| useWrappers | bool | Boolean flag to use or not use token wrappers |
| thresholdFilter | uint256 | The threshold percentage (from 0 to 100) used to filter out rates below the threshold |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
weightedRate | uint256 | weighted rate between the two tokens |

### getRateWithCustomConnectors

```solidity
function getRateWithCustomConnectors(contract IERC20 srcToken, contract IERC20 dstToken, bool useWrappers, contract IERC20[] customConnectors, uint256 thresholdFilter) public view returns (uint256 weightedRate)
```
WARNING!
   Usage of the dex oracle on chain is highly discouraged!
   getRate function can be easily manipulated inside transaction!
Returns the weighted rate between two tokens using custom connectors, with the option to filter out rates below a certain threshold.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| srcToken | contract IERC20 | The source token |
| dstToken | contract IERC20 | The destination token |
| useWrappers | bool | Boolean flag to use or not use token wrappers |
| customConnectors | contract IERC20[] | An array of custom connectors to use |
| thresholdFilter | uint256 | The threshold percentage (from 0 to 100) used to filter out rates below the threshold |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
weightedRate | uint256 | The weighted rate between the two tokens |

### getRatesAndWeightsWithCustomConnectors

```solidity
function getRatesAndWeightsWithCustomConnectors(contract IERC20 srcToken, contract IERC20 dstToken, bool useWrappers, contract IERC20[] customConnectors, uint256 thresholdFilter) public view returns (uint256 wrappedPrice, struct OraclePrices.Data ratesAndWeights)
```
WARNING!
   Usage of the dex oracle on chain is highly discouraged!
   getRate function can be easily manipulated inside transaction!
Returns the wrapped price and list of rates by oracles between two tokens using custom connectors, with the option to filter out rates below a certain threshold.
        If the wrapped price is not 0, it means that there is a wrapper with a rate that does not depend on liquidity volume,
        so the list of rates from oracles doesn't matter and can be non-full.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| srcToken | contract IERC20 | The source token |
| dstToken | contract IERC20 | The destination token |
| useWrappers | bool | Boolean flag to use or not use token wrappers |
| customConnectors | contract IERC20[] | An array of custom connectors to use |
| thresholdFilter | uint256 | The threshold percentage (from 0 to 100) used to filter out rates below the threshold |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
wrappedPrice | uint256 | The wrapped rate |
ratesAndWeights | struct OraclePrices.Data | {OraclePrices.Data} object containing the rates and weights from different oracles if wrappedPrice is 0 |

### getRateToEth

```solidity
function getRateToEth(contract IERC20 srcToken, bool useSrcWrappers) external view returns (uint256 weightedRate)
```
WARNING!
   Usage of the dex oracle on chain is highly discouraged!
   getRate function can be easily manipulated inside transaction!
The same as `getRate` but checks against `ETH` and `WETH` only

### getRateToEthWithThreshold

```solidity
function getRateToEthWithThreshold(contract IERC20 srcToken, bool useSrcWrappers, uint256 thresholdFilter) external view returns (uint256 weightedRate)
```
WARNING!
   Usage of the dex oracle on chain is highly discouraged!
   getRate function can be easily manipulated inside transaction!
The same as `getRate` but checks against `ETH` and `WETH` only

### getRateToEthWithCustomConnectors

```solidity
function getRateToEthWithCustomConnectors(contract IERC20 srcToken, bool useSrcWrappers, contract IERC20[] customConnectors, uint256 thresholdFilter) public view returns (uint256 weightedRate)
```
WARNING!
   Usage of the dex oracle on chain is highly discouraged!
   getRate function can be easily manipulated inside transaction!
The same as `getRateWithCustomConnectors` but checks against `ETH` and `WETH` only

### getRatesAndWeightsToEthWithCustomConnectors

```solidity
function getRatesAndWeightsToEthWithCustomConnectors(contract IERC20 srcToken, bool useSrcWrappers, contract IERC20[] customConnectors, uint256 thresholdFilter) public view returns (uint256 wrappedPrice, struct OraclePrices.Data ratesAndWeights)
```
WARNING!
   Usage of the dex oracle on chain is highly discouraged!
   getRate function can be easily manipulated inside transaction!
The same as `getRatesAndWeightsWithCustomConnectors` but checks against `ETH` and `WETH` only

### _getWrappedTokens

```solidity
function _getWrappedTokens(contract IERC20 token, bool useWrappers) internal view returns (contract IERC20[] wrappedTokens, uint256[] rates)
```

### _getAllConnectors

```solidity
function _getAllConnectors(contract IERC20[] customConnectors) internal view returns (contract IERC20[][2] allConnectors)
```

### Events
### OracleAdded

```solidity
event OracleAdded(contract IOracle oracle, enum OffchainOracle.OracleType oracleType)
```

### OracleRemoved

```solidity
event OracleRemoved(contract IOracle oracle, enum OffchainOracle.OracleType oracleType)
```

### ConnectorAdded

```solidity
event ConnectorAdded(contract IERC20 connector)
```

### ConnectorRemoved

```solidity
event ConnectorRemoved(contract IERC20 connector)
```

### MultiWrapperUpdated

```solidity
event MultiWrapperUpdated(contract MultiWrapper multiWrapper)
```

### Errors
### ArraysLengthMismatch

```solidity
error ArraysLengthMismatch()
```

### OracleAlreadyAdded

```solidity
error OracleAlreadyAdded()
```

### ConnectorAlreadyAdded

```solidity
error ConnectorAlreadyAdded()
```

### InvalidOracleTokenKind

```solidity
error InvalidOracleTokenKind()
```

### UnknownOracle

```solidity
error UnknownOracle()
```

### UnknownConnector

```solidity
error UnknownConnector()
```

### SameTokens

```solidity
error SameTokens()
```

### TooBigThreshold

```solidity
error TooBigThreshold()
```

