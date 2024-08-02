// SPDX-License-Identifier: MIT

pragma solidity 0.8.23;

// solhint-disable func-name-mixedcase

interface ICurveMetaregistry {
    function find_pools_for_coins(address srcToken, address dstToken) external view returns (address[] memory);
    function get_coin_indices(address _pool, address _from, address _to) external view returns (int128, int128, bool);
    function get_underlying_balances(address _pool) external view returns (uint256[8] memory);
}
