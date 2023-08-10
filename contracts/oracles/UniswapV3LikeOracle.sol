// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "../interfaces/IOracle.sol";
import "../interfaces/IUniswapV3Pool.sol";
import "../libraries/OraclePrices.sol";

contract UniswapV3LikeOracle is IOracle {
    using Address for address;
    using OraclePrices for OraclePrices.Data;
    using Math for uint256;

    IERC20 private constant _NONE = IERC20(0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF);
    int24 private constant _TICK_STEPS = 2;

    uint256 public immutable supportedFeesCount;
    address public immutable factory;
    bytes32 public immutable initcodeHash;
    uint24[10] public fees;

    constructor(address _factory, bytes32 _initcodeHash, uint24[] memory _fees) {
        factory = _factory;
        initcodeHash = _initcodeHash;
        supportedFeesCount = _fees.length;
        unchecked {
            for (uint256 i = 0; i < supportedFeesCount; i++) {
                fees[i] = _fees[i];
            }
        }
    }

    function getRate(IERC20 srcToken, IERC20 dstToken, IERC20 connector, uint256 thresholdFilter) external override view returns (uint256 rate, uint256 weight) {
        OraclePrices.Data memory ratesAndWeights;
        unchecked {
            if (connector == _NONE) {
                ratesAndWeights = OraclePrices.init(supportedFeesCount);
                for (uint256 i = 0; i < supportedFeesCount; i++) {
                    (uint256 rate0, uint256 w) = _getRate(srcToken, dstToken, fees[i]);
                    ratesAndWeights.append(OraclePrices.OraclePrice(rate0, w));
                }
            } else {
                ratesAndWeights = OraclePrices.init(supportedFeesCount**2);
                for (uint256 i = 0; i < supportedFeesCount; i++) {
                    for (uint256 j = 0; j < supportedFeesCount; j++) {
                        (uint256 rate0, uint256 w0) = _getRate(srcToken, connector, fees[i]);
                        if (w0 == 0) {
                            continue;
                        }
                        (uint256 rate1, uint256 w1) = _getRate(connector, dstToken, fees[j]);
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

    function _getRate(IERC20 srcToken, IERC20 dstToken, uint24 fee) internal view returns (uint256 rate, uint256 liquidity) {
        (IERC20 token0, IERC20 token1) = srcToken < dstToken ? (srcToken, dstToken) : (dstToken, srcToken);
        address pool = _getPool(address(token0), address(token1), fee);
        if (!pool.isContract() ) {
            return (0, 0);
        }
        liquidity = IUniswapV3Pool(pool).liquidity();
        if (liquidity == 0) {
            return (0, 0);
        }
        (uint256 sqrtPriceX96, int24 tick) = IUniswapV3Pool(pool).slot0();
        int24 tickSpacing = IUniswapV3Pool(pool).tickSpacing();
        tick = tick / tickSpacing * tickSpacing;
        int256 liquidityShiftsLeft = int256(liquidity);
        int256 liquidityShiftsRight = int256(liquidity);
        unchecked {
            for (int24 i = 0; i <= _TICK_STEPS; i++) {
                (, int256 liquidityNet,,,,,,) = IUniswapV3Pool(pool).ticks(tick + i * tickSpacing);
                liquidityShiftsRight += liquidityNet;
                liquidity = Math.min(liquidity, uint256(liquidityShiftsRight));
                if (liquidityShiftsRight == 0) {
                    return (0, 0);
                }
                (, liquidityNet,,,,,,) = IUniswapV3Pool(pool).ticks(tick - i * tickSpacing);
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

    function _getPool(address token0, address token1, uint24 fee) private view returns (address) {
        return address(uint160(uint256(
                keccak256(
                    abi.encodePacked(
                        hex'ff',
                        factory,
                        keccak256(abi.encode(token0, token1, fee)),
                        initcodeHash
                    )
                )
            )));
    }
}
