
## KyberDmmOracle

### Functions list
- [constructor(_factory) public](#constructor)
- [getRate(srcToken, dstToken, connector, thresholdFilter) external](#getrate)

### Functions
### constructor

```solidity
constructor(contract IKyberDmmFactory _factory) public
```

### getRate

```solidity
function getRate(contract IERC20 srcToken, contract IERC20 dstToken, contract IERC20 connector, uint256 thresholdFilter) external view returns (uint256 rate, uint256 weight)
```

