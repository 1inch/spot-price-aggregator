
## StataTokenWrapper

### Functions list
- [constructor(staticATokenFactory) public](#constructor)
- [addMarkets(tokens) external](#addmarkets)
- [removeMarkets(tokens) external](#removemarkets)
- [wrap(token) external](#wrap)

### Functions
### constructor

```solidity
constructor(contract IStaticATokenFactory staticATokenFactory) public
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

