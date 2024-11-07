
## ChainlinkOracle

### Functions list
- [constructor(_chainlink) public](#constructor)
- [getRate(srcToken, dstToken, connector, ) external](#getrate)

### Errors list
- [RateTooOld() ](#ratetooold)

### Functions
### constructor

```solidity
constructor(contract IChainlink _chainlink) public
```

### getRate

```solidity
function getRate(contract IERC20 srcToken, contract IERC20 dstToken, contract IERC20 connector, uint256) external view returns (uint256 rate, uint256 weight)
```

### Errors
### RateTooOld

```solidity
error RateTooOld()
```

