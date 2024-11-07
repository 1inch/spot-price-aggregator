
## SynthetixOracle

### Functions list
- [constructor(_proxy) public](#constructor)
- [getRate(srcToken, dstToken, connector, ) external](#getrate)

### Errors list
- [UnregisteredToken() ](#unregisteredtoken)
- [InvalidRate() ](#invalidrate)

### Functions
### constructor

```solidity
constructor(contract ISynthetixProxy _proxy) public
```

### getRate

```solidity
function getRate(contract IERC20 srcToken, contract IERC20 dstToken, contract IERC20 connector, uint256) external view returns (uint256 rate, uint256 weight)
```

### Errors
### UnregisteredToken

```solidity
error UnregisteredToken()
```

### InvalidRate

```solidity
error InvalidRate()
```

