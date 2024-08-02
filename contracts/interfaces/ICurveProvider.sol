// SPDX-License-Identifier: MIT

pragma solidity 0.8.23;

// solhint-disable func-name-mixedcase

interface ICurveProvider {
    function get_address (uint256 _id) external view returns (address);
}

interface ICurveRateProvider {
    struct Quote {
        uint256 source_token_index;
        uint256 dest_token_index;
        bool is_underlying;
        uint256 amount_out;
        address pool;
        uint256 source_token_pool_balance;
        uint256 dest_token_pool_balance;
        uint8 pool_type; // 0 for stableswap, 1 for cryptoswap, 2 for LLAMMA.
    }

    function get_quotes (address source_token, address destination_token, uint256 amount_in) external view returns (ICurveRateProvider.Quote[] memory quote);
}
