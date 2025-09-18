// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

import "../interfaces/IOracle.sol";
import "../interfaces/IUniswapV4StateView.sol";
import "../libraries/OraclePrices.sol";

contract UniswapV4BackGeoOracle is IOracle {
    using OraclePrices for OraclePrices.Data;
    using Math for uint256;

    IERC20 private constant _NONE = IERC20(0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF);

    IUniswapV4StateView public immutable STATE_VIEW;

    address public immutable BACK_GEO_ORACLE;

    uint24 public constant FEE = 0;
    int24 public constant MAX_TICK_SPACING = type(int16).max;
    uint8 private constant _ONE = 1;

    constructor(
        IUniswapV4StateView _stateView,
        address _backGeoOracle
    ) {
        STATE_VIEW = _stateView;
        BACK_GEO_ORACLE = _backGeoOracle;
    }

    function getRate(
        IERC20 srcToken,
        IERC20 dstToken,
        IERC20 connector,
        uint256 thresholdFilter
    ) external view override returns (uint256 rate, uint256 weight) {
        if (connector != _NONE) revert ConnectorShouldBeNone();

        OraclePrices.Data memory ratesAndWeights = OraclePrices.init(_ONE);

        (uint256 r, uint256 w) = _getRateDirect(srcToken, dstToken, FEE, MAX_TICK_SPACING);
        ratesAndWeights.append(OraclePrices.OraclePrice(r, w));

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
            hooks: BACK_GEO_ORACLE
        }));

        liquidity = uint256(STATE_VIEW.getLiquidity(id));
        if (liquidity == 0) return (0, 0);

        (uint160 sqrtPriceX96, int24 tick,,) = STATE_VIEW.getSlot0(id);
        tick = (tick / tickSpacing) * tickSpacing;

        int256 liquidityShiftsRight = int256(liquidity);
        int256 liquidityShiftsLeft = int256(liquidity);

        unchecked {
            for (int24 i = 0; i <= _TICK_STEPS; i++) {
                int256 nextTick = int256(tick) + int256(i) * int256(tickSpacing);
                (, int128 liquidityNet) = STATE_VIEW.getTickLiquidity(id, tick + i * tickSpacing);
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
            // rate = (uint256(sqrtPriceX96) * uint256(sqrtPriceX96) * 1e18) >> 192;
            rate = Math.mulDiv(
                Math.mulDiv(uint256(sqrtPriceX96), uint256(sqrtPriceX96), 1 << 96),
                1e18,
                1 << 96
            );
        } else {
            uint256 num = (1e18) << 192;
            rate = num / uint256(sqrtPriceX96) / uint256(sqrtPriceX96);
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