
## CompoundLikeWrapper

### Functions list
- [constructor(comptroller, cBase) public](#constructor)
- [addMarkets(markets) external](#addmarkets)
- [removeMarkets(markets) external](#removemarkets)
- [wrap(token) external](#wrap)

### Functions
### constructor

```solidity
constructor(contract IComptroller comptroller, contract IERC20 cBase) public
```

### addMarkets

```solidity
function addMarkets(contract ICToken[] markets) external
```

### removeMarkets

```solidity
function removeMarkets(contract ICToken[] markets) external
```

### wrap

```solidity
function wrap(contract IERC20 token) external view returns (contract IERC20 wrappedToken, uint256 rate)
```

