// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "../interfaces/IOracle.sol";
import "../interfaces/ICurveProvider.sol";
import "../interfaces/ICurveRegistry.sol";
import "../interfaces/ICurveSwap.sol";
import "../libraries/OraclePrices.sol";

contract CurveOracle is IOracle {
    using OraclePrices for OraclePrices.Data;
    using Math for uint256;

    IERC20 private constant _NONE = IERC20(0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF);

    uint256 public immutable MAX_POOLS;
    uint256 public immutable REGISTRIES_COUNT;
    ICurveRegistry[11] public registries;

    constructor(ICurveProvider _addressProvider, uint256 _maxPools, uint256[] memory _registryIds) {
        MAX_POOLS = _maxPools;
        REGISTRIES_COUNT = _registryIds.length;
        unchecked {
            for (uint256 i = 0; i < REGISTRIES_COUNT; i++) {
                registries[i] = ICurveRegistry(_addressProvider.get_address(_registryIds[i]));
            }
        }
    }

    function getRate(IERC20 _srcToken, IERC20 _dstToken, IERC20 connector, uint256 thresholdFilter) external view override returns (uint256 rate, uint256 weight) {
        if(connector != _NONE) revert ConnectorShouldBeNone();

        address srcToken = address(_srcToken);
        address dstToken = address(_dstToken);
        OraclePrices.Data memory ratesAndWeights = OraclePrices.init(MAX_POOLS);
        uint256 index = 0;
        for (uint256 i = 0; i < REGISTRIES_COUNT && index < MAX_POOLS; i++) {
            address pool = registries[i].find_pool_for_coins(srcToken, dstToken, index);
            while (pool != address(0) && index < MAX_POOLS) {
                (int128 srcTokenIndex, int128 dstTokenIndex, bool isUnderlying) = registries[i].get_coin_indices(pool, srcToken, dstToken);
                uint256 b0;
                uint256 b1;
                uint256 w;
                if (!isUnderlying) {
                    uint256[8] memory balances = registries[i].get_balances(pool);
                    w = (balances[uint128(srcTokenIndex)] * balances[uint128(dstTokenIndex)]).sqrt();
                    b0 = balances[uint128(srcTokenIndex)] / 10000;
                    if (b0 == 0) {
                        pool = registries[i].find_pool_for_coins(srcToken, dstToken, ++index);
                        continue;
                    }
                    (bool success, bytes memory data) = pool.staticcall(abi.encodeWithSelector(ICurveSwap.get_dy.selector, srcTokenIndex, dstTokenIndex, b0));
                    if (success && data.length == 32) {
                        b1 = abi.decode(data, (uint256));
                    } else {
                        b1 = ICurveSwapNew(pool).get_dy(uint128(srcTokenIndex), uint128(dstTokenIndex), b0);
                    }
                } else {
                    uint256[8] memory balances = registries[i].get_underlying_balances(pool);
                    w = (balances[uint128(srcTokenIndex)] * balances[uint128(dstTokenIndex)]).sqrt();
                    b0 = balances[uint128(srcTokenIndex)] / 10000;
                    if (b0 == 0) {
                        pool = registries[i].find_pool_for_coins(srcToken, dstToken, ++index);
                        continue;
                    }
                    (bool success, bytes memory data) = pool.staticcall(abi.encodeWithSelector(ICurveSwap.get_dy_underlying.selector, srcTokenIndex, dstTokenIndex, b0));
                    if (success && data.length == 32) {
                        b1 = abi.decode(data, (uint256));
                    } else {
                        b1 = ICurveSwapNew(pool).get_dy_underlying(uint128(srcTokenIndex), uint128(dstTokenIndex), b0);
                    }
                }
                ratesAndWeights.append(OraclePrices.OraclePrice(Math.mulDiv(b1, 1e18, b0), w));
                pool = registries[i].find_pool_for_coins(srcToken, dstToken, ++index);
            }
        }
        (rate, weight) = ratesAndWeights.getRateAndWeight(thresholdFilter);
    }
}
