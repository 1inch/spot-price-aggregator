// SPDX-License-Identifier: MIT

pragma solidity 0.8.11;
pragma abicoder v1;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
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

        address srcToken = address(_srcToken);
        address dstToken = address(_dstToken);
        uint256 index = 0;
        ICurveRegistry registry = ICurveRegistry(addressProvider.get_address(0));
        address pool = registry.find_pool_for_coins(srcToken, dstToken, index);

        require(pool != address(0), "CO: no pools");

        uint256 b0;
        uint256 b1;

        while (pool != address(0)) {
            (int128 srcTokenIndex, int128 dstTokenIndex, bool isUnderlying) = registry.get_coin_indices(pool, srcToken, dstToken);
            b0 = 10 ** ERC20(srcToken).decimals();
            if (!isUnderlying) {
                b1 = ICurveSwap(pool).get_dy(srcTokenIndex, dstTokenIndex, b0);
            } else {
                b1 = ICurveSwap(pool).get_dy_underlying(srcTokenIndex, dstTokenIndex, b0);
            }

            uint256 w = b0 * b1;
            rate = rate + (b1 * 1e18 / b0 * w);
            weight = weight + w;

            pool = registry.find_pool_for_coins(srcToken, dstToken, ++index);
        }

        if (weight > 0) {
            rate = rate / weight;
            weight = weight.sqrt();
        }
    }
}
