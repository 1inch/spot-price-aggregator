
## Blacklist

Contract is used to blacklist specific pools in the oracle.

### Functions list
- [constructor(initialBlacklist, owner) public](#constructor)
- [toggleBlacklistAddress(pool) external](#toggleblacklistaddress)

### Events list
- [BlacklistUpdated(pool, isBlacklisted) ](#blacklistupdated)

### Functions
### constructor

```solidity
constructor(address[] initialBlacklist, address owner) public
```

### toggleBlacklistAddress

```solidity
function toggleBlacklistAddress(address pool) external
```

### Events
### BlacklistUpdated

```solidity
event BlacklistUpdated(address pool, bool isBlacklisted)
```

