
## DodoV2Oracle

### Functions list
- [constructor(_DVMFactory) public](#constructor)
- [getRate(srcToken, dstToken, connector, thresholdFilter) external](#getrate)
- [_getMachines(srcToken, dstToken) internal](#_getmachines)
- [_getDodoInfo(dvm, isSrcBase) internal](#_getdodoinfo)

### Functions
### constructor

```solidity
constructor(contract IDVMFactory _DVMFactory) public
```

### getRate

```solidity
function getRate(contract IERC20 srcToken, contract IERC20 dstToken, contract IERC20 connector, uint256 thresholdFilter) external view returns (uint256 rate, uint256 weight)
```

### _getMachines

```solidity
function _getMachines(address srcToken, address dstToken) internal view returns (address[] machines, bool isSrcBase)
```

### _getDodoInfo

```solidity
function _getDodoInfo(contract IDVM dvm, bool isSrcBase) internal view returns (uint256 rate, uint256 balanceSrc, uint256 balanceDst)
```

