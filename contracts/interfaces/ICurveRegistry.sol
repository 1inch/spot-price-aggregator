// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

// solhint-disable func-name-mixedcase

interface ICurveRegistry {
    function pool_count() external view returns (uint256);
    function pool_list(uint256 index) external view returns (address);

    // MAIN_REGISTRY, METAPOOL_FACTORY, CRYPTOSWAP_REGISTRY, CRYPTOPOOL_FACTORY, METAREGISTRY, CRVUSD_PLAIN_POOLS, CURVE_TRICRYPTO_FACTORY
    function find_pool_for_coins(address _srcToken, address _dstToken, uint256 _index) external view returns (address);

    // MAIN_REGISTRY, METAPOOL_FACTORY, METAREGISTRY, CRVUSD_PLAIN_POOLS
    function get_coin_indices(address _pool, address _srcToken, address _dstToken) external view returns (int128, int128, bool);
    // CRYPTOSWAP_REGISTRY, CRYPTOPOOL_FACTORY, CURVE_TRICRYPTO_FACTORY - returns (uint256,uint256);

    // MAIN_REGISTRY, CRYPTOSWAP_REGISTRY, METAREGISTRY
    function get_balances(address _pool) external view returns (uint256[8] memory);
    // METAPOOL_FACTORY, CRVUSD_PLAIN_POOLS - returns (uint256[4]);
    // CURVE_TRICRYPTO_FACTORY              - returns (uint256[3]);
    // CRYPTOPOOL_FACTORY                   - returns (uint256[2]);

    // MAIN_REGISTRY, METAPOOL_FACTORY, METAREGISTRY, CRVUSD_PLAIN_POOLS
    function get_underlying_balances(address _pool) external view returns (uint256[8] memory);
    // CRYPTOSWAP_REGISTRY, CRYPTOPOOL_FACTORY - NO METHOD
}
