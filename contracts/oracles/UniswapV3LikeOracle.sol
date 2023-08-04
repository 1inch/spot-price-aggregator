// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "../interfaces/IOracle.sol";
import "../interfaces/IUniswapV3Pool.sol";
import "../libraries/OraclePrices.sol";
import "../libraries/Sqrt.sol";

contract UniswapV3LikeOracle is IOracle {
    using Address for address;
    using SafeMath for uint256;
    using OraclePrices for OraclePrices.Data;
    using Sqrt for uint256;

    IERC20 private constant _NONE = IERC20(0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF);
    uint256 private constant _SUPPORTED_FEES_COUNT = 4;
    int24 private constant _TICK_STEPS = 2;

    address public immutable factory;
    bytes32 public immutable initcodeHash;
    uint24[_SUPPORTED_FEES_COUNT] public fees;

    constructor(address _factory, bytes32 _initcodeHash, uint24[_SUPPORTED_FEES_COUNT] memory _fees) {
        factory = _factory;
        initcodeHash = _initcodeHash;
        fees = _fees;
    }

    function getRate(IERC20 srcToken, IERC20 dstToken, IERC20 connector, uint256 thresholdFilter) external override view returns (uint256 rate, uint256 weight) {
        OraclePrices.Data memory ratesAndWeights;
        unchecked {
            if (connector == _NONE) {
                ratesAndWeights = OraclePrices.init(_SUPPORTED_FEES_COUNT);
                for (uint256 i = 0; i < _SUPPORTED_FEES_COUNT; i++) {
                    (uint256 rate0, uint256 w) = _getRate(srcToken, dstToken, fees[i]);
                    ratesAndWeights.append(OraclePrices.OraclePrice(rate0, w));
                }
            } else {
                ratesAndWeights = OraclePrices.init(_SUPPORTED_FEES_COUNT**2);
                for (uint256 i = 0; i < _SUPPORTED_FEES_COUNT; i++) {
                    for (uint256 j = 0; j < _SUPPORTED_FEES_COUNT; j++) {
                        (uint256 rate0, uint256 w0) = _getRate(srcToken, connector, fees[i]);
                        if (w0 == 0) {
                            continue;
                        }
                        (uint256 rate1, uint256 w1) = _getRate(connector, dstToken, fees[j]);
                        if (w1 == 0) {
                            continue;
                        }
                        uint256 w = Math.min(w0, w1);
                        ratesAndWeights.append(OraclePrices.OraclePrice(rate0 * rate1 / 1e18, w));
                    }
                }
            }
        }
        (rate, weight) = ratesAndWeights.getRateAndWeight(thresholdFilter);
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
