
## FulcrumWrapperLegacy

### Functions list
- [constructor(_owner) public](#constructor)
- [addMarkets(markets) external](#addmarkets)
- [removeMarkets(markets) external](#removemarkets)
- [wrap(token) external](#wrap)

### Functions
### constructor

```solidity
constructor(address _owner) public
```

### addMarkets

```solidity
function addMarkets(contract ILoanToken[] markets) external
```

### removeMarkets

```solidity
function removeMarkets(contract ILoanToken[] markets) external
```

### wrap

```solidity
function wrap(contract IERC20 token) external view returns (contract IERC20 wrappedToken, uint256 rate)
```

