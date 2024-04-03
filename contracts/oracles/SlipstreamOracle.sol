// SPDX-License-Identifier: MIT

pragma solidity 0.8.23;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
import "../interfaces/IOracle.sol";
import "../interfaces/ISlipstream.sol";
import "../libraries/OraclePrices.sol";

contract SlipstreamOracle is IOracle {
    using Address for address;
    using OraclePrices for OraclePrices.Data;
    using Math for uint256;

    IERC20 private constant _NONE = IERC20(0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF);
    int24 private constant _TICK_STEPS = 2;

    uint256 public immutable SUPPORTED_TICK_SPACINGS_COUNT;
    address public immutable SLIPSTREAM_FACTORY;
    address public immutable SLIPSTREAM_IMPLEMENTATION;
    int24[10] public tickSpacings;

    constructor(address _factory, address _implementation, int24[] memory _tickSpacings) {
        SLIPSTREAM_FACTORY = _factory;
        SLIPSTREAM_IMPLEMENTATION = _implementation;
        SUPPORTED_TICK_SPACINGS_COUNT = _tickSpacings.length;
        unchecked {
            for (uint256 i = 0; i < SUPPORTED_TICK_SPACINGS_COUNT; i++) {
                tickSpacings[i] = _tickSpacings[i];
            }
        }
    }

    function getRate(IERC20 srcToken, IERC20 dstToken, IERC20 connector, uint256 thresholdFilter) external override view returns (uint256 rate, uint256 weight) {
        OraclePrices.Data memory ratesAndWeights;
        unchecked {
            if (connector == _NONE) {
                ratesAndWeights = OraclePrices.init(SUPPORTED_TICK_SPACINGS_COUNT);
                for (uint256 i = 0; i < SUPPORTED_TICK_SPACINGS_COUNT; i++) {
                    (uint256 rate0, uint256 w) = _getRate(srcToken, dstToken, tickSpacings[i]);
                    ratesAndWeights.append(OraclePrices.OraclePrice(rate0, w));
                }
            } else {
                ratesAndWeights = OraclePrices.init(SUPPORTED_TICK_SPACINGS_COUNT**2);
                for (uint256 i = 0; i < SUPPORTED_TICK_SPACINGS_COUNT; i++) {
                    for (uint256 j = 0; j < SUPPORTED_TICK_SPACINGS_COUNT; j++) {
                        (uint256 rate0, uint256 w0) = _getRate(srcToken, connector, tickSpacings[i]);
                        if (w0 == 0) {
                            continue;
                        }
                        (uint256 rate1, uint256 w1) = _getRate(connector, dstToken, tickSpacings[j]);
                        if (w1 == 0) {
                            continue;
                        }
                        ratesAndWeights.append(OraclePrices.OraclePrice(Math.mulDiv(rate0, rate1, 1e18), Math.min(w0, w1)));
                    }
                }
            }
        }
        return ratesAndWeights.getRateAndWeight(thresholdFilter);
    }

    function _getRate(IERC20 srcToken, IERC20 dstToken, int24 tickSpacing) internal view returns (uint256 rate, uint256 liquidity) {
        (IERC20 token0, IERC20 token1) = srcToken < dstToken ? (srcToken, dstToken) : (dstToken, srcToken);
        address pool = _getPool(address(token0), address(token1), tickSpacing);
        if (pool.code.length == 0) { // !pool.isContract()
            return (0, 0);
        }
        liquidity = ISlipstream(pool).liquidity();
        if (liquidity == 0) {
            return (0, 0);
        }
        (uint256 sqrtPriceX96, int24 tick,,,,) = ISlipstream(pool).slot0();
        tick = tick / tickSpacing * tickSpacing;
        int256 liquidityShiftsLeft = int256(liquidity);
        int256 liquidityShiftsRight = int256(liquidity);
        unchecked {
            for (int24 i = 0; i <= _TICK_STEPS; i++) {
                (, int256 liquidityNet,,,,,,,,) = ISlipstream(pool).ticks(tick + i * tickSpacing);
                liquidityShiftsRight += liquidityNet;
                liquidity = Math.min(liquidity, uint256(liquidityShiftsRight));
                if (liquidityShiftsRight == 0) {
                    return (0, 0);
                }
                (, liquidityNet,,,,,,,,) = ISlipstream(pool).ticks(tick - i * tickSpacing);
                liquidityShiftsLeft -= liquidityNet;
                liquidity = Math.min(liquidity, uint256(liquidityShiftsLeft));
                if (liquidityShiftsLeft == 0) {
                    return (0, 0);
                }
            }
        }
        if (srcToken == token0) {
            rate = (((1e18 * sqrtPriceX96) >> 96) * sqrtPriceX96) >> 96;
        } else {
            rate = (1e18 << 192) / sqrtPriceX96 / sqrtPriceX96;
        }
    }

    function _getPool(address token0, address token1, int24 tickSpacing) private view returns (address) {
        return Clones.predictDeterministicAddress({
            implementation: SLIPSTREAM_IMPLEMENTATION,
            salt: keccak256(abi.encode(token0, token1, tickSpacing)),
            deployer: SLIPSTREAM_FACTORY
        });
    }
}
