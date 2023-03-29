// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

// solhint-disable func-name-mixedcase

interface ICurveRegistry {
    function find_pool_for_coins(address _srcToken, address _dstToken, uint256 _index) external view returns (address);
    function get_coin_indices(address _pool, address _srcToken, address _dstToken) external view returns (int128, int128, bool);
    function get_balances(address _pool) external view returns (uint256[8] memory);
    function get_underlying_balances(address _pool) external view returns (uint256[8] memory);
}
