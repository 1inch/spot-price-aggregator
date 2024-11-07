
## ICurveProvider

### Functions list
- [get_address(_id) external](#get_address)

### Functions
### get_address

```solidity
function get_address(uint256 _id) external view returns (address)
```

## ICurveRateProvider

### Types list
- [Quote](#quote)

### Functions list
- [get_quotes(source_token, destination_token, amount_in) external](#get_quotes)

### Types
### Quote

```solidity
struct Quote {
  uint256 source_token_index;
  uint256 dest_token_index;
  bool is_underlying;
  uint256 amount_out;
  address pool;
  uint256 source_token_pool_balance;
  uint256 dest_token_pool_balance;
  uint8 pool_type;
}
```

### Functions
### get_quotes

```solidity
function get_quotes(address source_token, address destination_token, uint256 amount_in) external view returns (struct ICurveRateProvider.Quote[] quote)
```

