// SPDX-License-Identifier: MIT

pragma solidity 0.8.23;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "../interfaces/IOracle.sol";
import "../interfaces/ICurveProvider.sol";
import "../interfaces/ICurveRegistry.sol";
import "../interfaces/ICurveSwap.sol";
import "../libraries/OraclePrices.sol";
import "../helpers/Blacklist.sol";

interface IMetaregistry {
    function find_pools_for_coins(address srcToken, address dstToken) external view returns (address[] memory);
    function get_coin_indices(address _pool, address _from, address _to) external view returns (int128, int128, bool);
    function get_underlying_balances(address _pool) external view returns (uint256[8] memory);
}

interface ICurvePool {
    function allowed_extra_profit() external view returns (uint256);
    function get_rate_mul() external view returns (uint256);
}

interface IStableSwapMeta {
    function get_dy_underlying(int128,int128,uint256) external view returns (uint256);
}

interface IStableSwap {
    function get_dy(int128,int128,uint256) external view returns (uint256);
}

interface ICryptoSwap {
    function get_dy(uint256,uint256,uint256) external view returns (uint256);
}

contract CurveOracle is IOracle {
    using OraclePrices for OraclePrices.Data;
    using Math for uint256;

    IERC20 private constant _NONE = IERC20(0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF);
    IERC20 private constant _ETH = IERC20(0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE);

    IMetaregistry public immutable CURVE_METAREGISTRY;

    constructor(IMetaregistry curveMetaregistry) {
        CURVE_METAREGISTRY = curveMetaregistry;
    }

    function _getPoolType(address pool) private view returns (uint8) {
        // 0 for stableswap, 1 for cryptoswap, 2 for LLAMMA.

        // check if cryptoswap
        (bool success, bytes memory data) = pool.staticcall(abi.encodeWithSelector(ICurvePool.allowed_extra_profit.selector));
        if (success && data.length >= 32) { // vyper could return redundant bytes
            return 1;
        }

        // check if llamma
        (success, data) = pool.staticcall(abi.encodeWithSelector(ICurvePool.get_rate_mul.selector));
        if (success && data.length >= 32) { // vyper could return redundant bytes
            return 2;
        }

        return 0;
    }

    function getRate(IERC20 srcToken, IERC20 dstToken, IERC20 connector, uint256 thresholdFilter) external view override returns (uint256 rate, uint256 weight) {
        if(connector != _NONE) revert ConnectorShouldBeNone();

        address[] memory pools = CURVE_METAREGISTRY.find_pools_for_coins(address(srcToken), address(dstToken));
        if (pools.length == 0) {
            return (0, 0);
        }

        OraclePrices.Data memory ratesAndWeights = OraclePrices.init(pools.length);
        for (uint256 k = 0; k < pools.length; k++) {
            // get coin indices
            int128 i;
            int128 j;
            bool isUnderlying = false;
            (i, j, isUnderlying) = CURVE_METAREGISTRY.get_coin_indices(pools[k], address(srcToken), address(dstToken));

            // get balances
            uint256[8] memory balances = CURVE_METAREGISTRY.get_underlying_balances(pools[k]);
            // skip if pool is too small
            balances[uint128(i)] = balances[uint128(i)] / 1e4;
            balances[uint128(j)] = balances[uint128(j)] / 1e4;
            if (balances[uint128(i)] == 0 || balances[uint128(j)] == 0) {
                continue;
            }

            // choose the right abi:
            uint8 poolType = _getPoolType(pools[k]);
            bytes4 selector;
            if (poolType == 0 && isUnderlying) {
                selector = IStableSwapMeta.get_dy_underlying.selector;
            } else if (poolType == 0 && !isUnderlying) {
                selector = IStableSwap.get_dy.selector;
            } else {
                selector = ICryptoSwap.get_dy.selector;
            }
            (bool success, bytes memory data) = pools[k].staticcall(abi.encodeWithSelector(selector, uint128(i), uint128(j), balances[uint128(i)]));
            if (success && data.length >= 32) { // vyper could return redundant bytes
                uint256 amountOut = abi.decode(data, (uint256));
                if (amountOut > 0) {
                    rate = amountOut * 1e18 / balances[uint128(i)];
                    weight = (balances[uint128(i)] * balances[uint128(j)]).sqrt();
                    ratesAndWeights.append(OraclePrices.OraclePrice(rate, weight));
                }
            }
        }
        return ratesAndWeights.getRateAndWeight(thresholdFilter);
    }
}
