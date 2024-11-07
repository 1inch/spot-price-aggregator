
## AaveWrapperV2

### Functions list
- [constructor(lendingPool) public](#constructor)
- [addMarkets(tokens) external](#addmarkets)
- [removeMarkets(tokens) external](#removemarkets)
- [wrap(token) external](#wrap)

### Functions
### constructor

```solidity
constructor(contract ILendingPoolV2 lendingPool) public
```

### addMarkets

```solidity
function addMarkets(contract IERC20[] tokens) external
```

### removeMarkets

```solidity
function removeMarkets(contract IERC20[] tokens) external
```

### wrap

```solidity
function wrap(contract IERC20 token) external view returns (contract IERC20 wrappedToken, uint256 rate)
```

