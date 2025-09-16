// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

import "../interfaces/IOracle.sol";
import "../interfaces/IUniswapV4StateView.sol";
import "../libraries/OraclePrices.sol";

contract UniswapV4LikeOracle is IOracle {
    using OraclePrices for OraclePrices.Data;
    using Math for uint256;

    IERC20 private constant _NONE = IERC20(0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF);
    int24 private constant _TICK_STEPS = 2;

    IUniswapV4StateView public immutable STATE_VIEW;

    uint24[] public fees;
    int24[] public spacings;

    constructor(
        IUniswapV4StateView _stateView,
        uint24[] memory _fees,
        int24[] memory _spacings
    ) {
        STATE_VIEW = _stateView;
        fees = _fees;
        spacings = _spacings;
    }

    function getRate(
        IERC20 srcToken,
        IERC20 dstToken,
        IERC20 connector,
        uint256 thresholdFilter
    ) external view override returns (uint256 rate, uint256 weight) {
        if (connector != _NONE) revert ConnectorShouldBeNone();

        OraclePrices.Data memory ratesAndWeights = OraclePrices.init(fees.length * spacings.length);

        for (uint256 i = 0; i < fees.length; i++) {
            for (uint256 k = 0; k < spacings.length; k++) {
                (uint256 r, uint256 w) = _getRateDirect(srcToken, dstToken, fees[i], spacings[k]);
                ratesAndWeights.append(OraclePrices.OraclePrice(r, w));
            }
        }

        return ratesAndWeights.getRateAndWeight(thresholdFilter);
    }

    function _getRateDirect(
        IERC20 srcToken,
        IERC20 dstToken,
        uint24 fee,
        int24 tickSpacing
    ) internal view returns (uint256 rate, uint256 liquidity) {
        (IERC20 token0, IERC20 token1, bool zeroForOne) =
            address(srcToken) < address(dstToken) ? (srcToken, dstToken, true) : (dstToken, srcToken, false);

        bytes32 id = _toId(PoolKey({
            currency0: address(token0),
            currency1: address(token1),
            fee: fee,
            tickSpacing: tickSpacing,
            hooks: address(0)
        }));

        liquidity = uint256(STATE_VIEW.getLiquidity(id));
        if (liquidity == 0) return (0, 0);

        (uint160 sqrtPriceX96, int24 tick,,) = STATE_VIEW.getSlot0(id);
        tick = (tick / tickSpacing) * tickSpacing;

        (, int128 liquidityNet) = STATE_VIEW.getTickLiquidity(id, tick);
        int256 liquidityShiftsRight = int256(liquidity) + liquidityNet;
        int256 liquidityShiftsLeft = int256(liquidity) - liquidityNet;
        if (liquidityShiftsRight == 0 || liquidityShiftsLeft == 0) {
            return (0, 0);
        }

        unchecked {
            for (int24 i = 1; i <= _TICK_STEPS; i++) {
                int256 nextTick = int256(tick) + int256(i) * int256(tickSpacing);
                (, liquidityNet) = STATE_VIEW.getTickLiquidity(id, tick + i * tickSpacing);
                liquidityShiftsRight += liquidityNet;
                liquidity = Math.min(liquidity, uint256(liquidityShiftsRight));
                if (liquidityShiftsRight == 0) {
                    return (0, 0);
                }

                nextTick = int256(tick) - int256(i) * int256(tickSpacing);
                (, liquidityNet) = STATE_VIEW.getTickLiquidity(id, tick - i * tickSpacing);
                liquidityShiftsLeft -= liquidityNet;
                liquidity = Math.min(liquidity, uint256(liquidityShiftsLeft));
                if (liquidityShiftsLeft == 0) {
                    return (0, 0);
                }
            }
        }

        if (zeroForOne) {
            rate = uint256(sqrtPriceX96)
                .mulDiv(uint256(sqrtPriceX96), 1 << 96)
                .mulDiv(1e18, 1 << 96);
        } else {
            rate = ((1e18) << 192) / sqrtPriceX96 / sqrtPriceX96;
        }
    }

    /// @notice Returns value equal to keccak256(abi.encode(poolKey))
    function _toId(PoolKey memory poolKey) internal pure returns (bytes32 poolId) {
        assembly ("memory-safe") { // solhint-disable-line no-inline-assembly
            // 0xa0 represents the total size of the poolKey struct (5 slots of 32 bytes)
            poolId := keccak256(poolKey, 0xa0)
        }
    }
}
