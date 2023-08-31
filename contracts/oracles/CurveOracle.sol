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

    struct FunctionInfo {
        function (address) external view returns (uint256[8] memory) balanceFunc;
        bytes4 dyFuncInt128Selector;
        function (uint256, uint256, uint256) external view returns (uint256) dyFuncUint256;
    }

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

    function getRate(IERC20 srcToken, IERC20 dstToken, IERC20 connector, uint256 thresholdFilter) external view override returns (uint256 rate, uint256 weight) {
        if(connector != _NONE) revert ConnectorShouldBeNone();

        OraclePrices.Data memory ratesAndWeights = OraclePrices.init(MAX_POOLS);
        FunctionInfo memory info;
        uint256 index = 0;
        for (uint256 i = 0; i < REGISTRIES_COUNT && index < MAX_POOLS; i++) {
            address pool = registries[i].find_pool_for_coins(address(srcToken), address(dstToken), index);
            while (pool != address(0) && index < MAX_POOLS) {
                (int128 srcTokenIndex, int128 dstTokenIndex, bool isUnderlying) = registries[i].get_coin_indices(pool, address(srcToken), address(dstToken));
                if (!isUnderlying) {
                    info = FunctionInfo({
                        balanceFunc: registries[i].get_balances,
                        dyFuncInt128Selector: ICurveSwap.get_dy.selector,
                        dyFuncUint256: ICurveSwapNew(pool).get_dy
                    });
                } else {
                    info = FunctionInfo({
                        balanceFunc: registries[i].get_underlying_balances,
                        dyFuncInt128Selector: ICurveSwap.get_dy_underlying.selector,
                        dyFuncUint256: ICurveSwapNew(pool).get_dy_underlying
                    });
                }

                uint256[8] memory balances = info.balanceFunc(pool);
                uint256 w = (balances[uint128(srcTokenIndex)] * balances[uint128(dstTokenIndex)]).sqrt();
                uint256 b0 = balances[uint128(srcTokenIndex)] / 10000;

                if (b0 != 0) {
                    uint256 b1;
                    (bool success, bytes memory data) = pool.staticcall(abi.encodeWithSelector(info.dyFuncInt128Selector, srcTokenIndex, dstTokenIndex, b0));
                    if (success && data.length == 32) {
                        b1 = abi.decode(data, (uint256));
                    } else {
                        b1 = info.dyFuncUint256(uint128(srcTokenIndex), uint128(dstTokenIndex), b0);
                    }
                    ratesAndWeights.append(OraclePrices.OraclePrice(Math.mulDiv(b1, 1e18, b0), w));
                }
                pool = registries[i].find_pool_for_coins(address(srcToken), address(dstToken), ++index);
            }
        }
        (rate, weight) = ratesAndWeights.getRateAndWeight(thresholdFilter);
    }
}
