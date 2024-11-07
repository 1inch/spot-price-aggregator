
## ILendingPoolV3

### Types list
- [TokenData](#tokendata)

### Functions list
- [getReserveTokensAddresses(asset) external](#getreservetokensaddresses)
- [getAllReservesTokens() external](#getallreservestokens)

### Types
### TokenData

```solidity
struct TokenData {
  string symbol;
  address tokenAddress;
}
```

### Functions
### getReserveTokensAddresses

```solidity
function getReserveTokensAddresses(address asset) external view returns (address aTokenAddress, address stableDebtTokenAddress, address variableDebtTokenAddress)
```

### getAllReservesTokens

```solidity
function getAllReservesTokens() external view returns (struct ILendingPoolV3.TokenData[])
```

