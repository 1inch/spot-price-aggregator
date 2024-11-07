
## Wrapper

### Functions list
- [constructor(base, wBase) internal](#constructor)
- [wrap(token) external](#wrap)
- [_wrap() internal](#_wrap)
- [_unwrap() internal](#_unwrap)

### Functions
### constructor

```solidity
constructor(contract IERC20 base, contract IERC20 wBase) internal
```

### wrap

```solidity
function wrap(contract IERC20 token) external view returns (contract IERC20 wrappedToken, uint256 rate)
```

### _wrap

```solidity
function _wrap() internal view virtual returns (contract IERC20 wrappedToken, uint256 rate)
```

### _unwrap

```solidity
function _unwrap() internal view virtual returns (contract IERC20 unwrappedToken, uint256 rate)
```

