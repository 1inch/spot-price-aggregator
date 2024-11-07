
## DodoOracle

### Functions list
- [constructor(_dodoZoo) public](#constructor)
- [getRate(srcToken, dstToken, connector, ) external](#getrate)
- [_getDodoInfo(srcToken, dstToken) internal](#_getdodoinfo)

### Functions
### constructor

```solidity
constructor(contract IDodoZoo _dodoZoo) public
```

### getRate

```solidity
function getRate(contract IERC20 srcToken, contract IERC20 dstToken, contract IERC20 connector, uint256) external view returns (uint256 rate, uint256 weight)
```

### _getDodoInfo

```solidity
function _getDodoInfo(address srcToken, address dstToken) internal view returns (uint256 rate, uint256 balanceSrc, uint256 balanceDst)
```

