// SPDX-License-Identifier: MIT

pragma solidity 0.8.15;
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

        while (pool != address(0)) {
            (int128 srcTokenIndex, int128 dstTokenIndex, bool isUnderlying) = registry.get_coin_indices(pool, srcToken, dstToken);
            uint256 b0;
            uint256 b1;
            uint256 w;
            if (!isUnderlying) {
                uint256[8] memory balances = registry.get_balances(pool);
                w = (balances[uint128(srcTokenIndex)] * balances[uint128(dstTokenIndex)]).sqrt();
                b0 = balances[uint128(srcTokenIndex)] / 10000;
                (bool success, bytes memory data) = pool.staticcall(abi.encodeWithSelector(ICurveSwap.get_dy.selector, srcTokenIndex, dstTokenIndex, b0));
                if (success && data.length == 32) {
                    b1 = abi.decode(data, (uint256));
                } else {
                    b1 = ICurveSwapNew(pool).get_dy(uint128(srcTokenIndex), uint128(dstTokenIndex), b0);
                }
            } else {
                uint256[8] memory balances = registry.get_underlying_balances(pool);
                uint256 srcDecimals = ERC20(srcToken).decimals();
                w = (balances[uint128(srcTokenIndex)] * balances[uint128(dstTokenIndex)] / (10 ** (36 - srcDecimals - ERC20(dstToken).decimals()))).sqrt();
                b0 = balances[uint128(srcTokenIndex)] / (10 ** (14 - srcDecimals));
                (bool success, bytes memory data) = pool.staticcall(abi.encodeWithSelector(ICurveSwap.get_dy_underlying.selector, srcTokenIndex, dstTokenIndex, b0));
                if (success && data.length == 32) {
                    b1 = abi.decode(data, (uint256));
                } else {
                    b1 = ICurveSwapNew(pool).get_dy_underlying(uint128(srcTokenIndex), uint128(dstTokenIndex), b0);
                }
            }

            rate += b1 * 1e18 / b0 * w;
            weight += w;

            pool = registry.find_pool_for_coins(srcToken, dstToken, ++index);
        }

        if (weight > 0) {
            unchecked { rate /= weight; }
        }
    }
}
