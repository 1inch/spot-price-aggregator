
## ChaiWrapper

### Functions list
- [constructor(base, wBase, pot) public](#constructor)
- [_wrap() internal](#_wrap)
- [_unwrap() internal](#_unwrap)
- [_rdivup(x, y) internal](#_rdivup)
- [_rmul(x, y) internal](#_rmul)

### Functions
### constructor

```solidity
constructor(contract IERC20 base, contract IERC20 wBase, contract IChaiPot pot) public
```

### _wrap

```solidity
function _wrap() internal view returns (contract IERC20 wrappedToken, uint256 rate)
```

### _unwrap

```solidity
function _unwrap() internal view returns (contract IERC20 unwrappedToken, uint256 rate)
```

### _rdivup

```solidity
function _rdivup(uint256 x, uint256 y) internal pure returns (uint256 z)
```

### _rmul

```solidity
function _rmul(uint256 x, uint256 y) internal pure returns (uint256 z)
```

