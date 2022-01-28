// SPDX-License-Identifier: MIT

pragma solidity 0.8.11;
pragma abicoder v1;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../interfaces/IOracle.sol";
import "../libraries/Sqrt.sol";

import "../interfaces/ICurveRegistry.sol";
import "../interfaces/ICurveProvider.sol";
import "../interfaces/ICurveSwap.sol";

contract CurveOracle is IOracle {
    using Sqrt for uint256;

    ICurveProvider public immutable addressProvider;
    IERC20 private constant _NONE = IERC20(0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF);

    constructor(ICurveProvider _addressProvider) {
        addressProvider = _addressProvider;
    }

    function getRate(IERC20 _srcToken, IERC20 _dstToken, IERC20 connector) external view override returns (uint256 rate, uint256 weight) {

        require(connector == _NONE, "connector should be NONE");

        ICurveRegistry registry;
        address pool;

        // first check crypto registry (curve v2) for pools and select first one
        registry = ICurveRegistry(addressProvider.get_address(5));
        pool = registry.find_pool_for_coins(address(_srcToken), address(_dstToken));

        // if not found, check main registry and select first one
        if (pool == address(0)){
            registry = ICurveRegistry(addressProvider.get_address(0));
            pool = registry.find_pool_for_coins(address(_srcToken), address(_dstToken));
        }

        // if not found, check factory registry (permissionless) and select first one
        if (pool == address(0)){
            registry = ICurveRegistry(addressProvider.get_address(3));
            pool = registry.find_pool_for_coins(address(_srcToken), address(_dstToken));
        }

        require(pool != address(0), "Pool does not exist");

        int128 a;
        int128 b;
        bool underlying;
        uint256[8] memory balances;
        (a, b, underlying) = registry.get_coin_indices(pool, address(_srcToken), address(_dstToken));

        if (!underlying) {
            rate = ICurveSwap(pool).get_dy(a, b, 1e6) * 1e12;
            balances = registry.get_balances(pool);
        } else {
            rate = ICurveSwap(pool).get_dy_underlying(a, b, 1e6) * 1e12;
            balances = registry.get_underlying_balances(pool);
        }
        require(rate != 0, "Swap rate not available");

        // this is for converting int128 -> uint
        int128 j = 0;
        uint256 srcBalance;
        uint256 dstBalance;
        for (uint256 i = 0; i < 8; i++) {
            if (j == a) {
                srcBalance = balances[i];
            } else if (j == b) {
                dstBalance = balances[i];
            }
            j++;
        }
        weight = (srcBalance * dstBalance).sqrt();
    }
}
