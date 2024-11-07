
## CompoundV3Wrapper

### Functions list
- [constructor(_owner) public](#constructor)
- [addMarkets(tokens) external](#addmarkets)
- [removeMarkets(tokens) external](#removemarkets)
- [wrap(token) external](#wrap)

### Functions
### constructor

```solidity
constructor(address _owner) public
```

### addMarkets

```solidity
function addMarkets(address[] tokens) external
```

### removeMarkets

```solidity
function removeMarkets(address[] tokens) external
```

### wrap

```solidity
function wrap(contract IERC20 token) external view returns (contract IERC20 wrappedToken, uint256 rate)
```

