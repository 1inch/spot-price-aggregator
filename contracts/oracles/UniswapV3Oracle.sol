// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;
pragma abicoder v2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "../interfaces/IOracle.sol";
import "../interfaces/IUniswapV3Pool.sol";
import "../libraries/Sqrt.sol";

contract UniswapV3Oracle is IOracle {
    using Address for address;
    using SafeMath for uint256;
    using Sqrt for uint256;

    bytes32 public constant POOL_INIT_CODE_HASH = 0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54;
    address public constant FACTORY = 0x1F98431c8aD98523631AE4a59f267346ea31F984;
    IERC20 private constant _NONE = IERC20(0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF);
    uint256 private constant _SUPPORTED_FEES_COUNT = 4;
    int24 private constant _TICK_STEPS = 2;

    function getRate(IERC20 srcToken, IERC20 dstToken, IERC20 connector) external override view returns (uint256 rate, uint256 weight) {
        uint24[_SUPPORTED_FEES_COUNT] memory fees = [uint24(100), 500, 3000, 10000];

        unchecked {
            if (connector == _NONE) {
                for (uint256 i = 0; i < _SUPPORTED_FEES_COUNT; i++) {
                    (uint256 rate0, uint256 w) = _getRate(srcToken, dstToken, fees[i]);
                    rate = rate.add(rate0.mul(w));
                    weight = weight.add(w);
                }
            } else {
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
                        rate = rate.add(rate0.mul(rate1).div(1e18).mul(w));
                        weight = weight.add(w);
                    }
                }
            }
        }

        if (weight > 0) {
            rate = rate / weight;
        }
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
        (uint256 sqrtPriceX96, int24 tick,,,,,) = IUniswapV3Pool(pool).slot0();
        int24 tickSpacing = IUniswapV3Pool(pool).tickSpacing();
        tick = tick / tickSpacing * tickSpacing;
        int256 liquidityShiftsLeft = int256(liquidity);
        int256 liquidityShiftsRight = int256(liquidity);
        for (int24 i = 1; i <= _TICK_STEPS; i++) {
            (, int256 liquidityNet,,,,,,) = IUniswapV3Pool(pool).ticks(tick + i * tickSpacing);
            liquidityShiftsRight += liquidityNet;
            if (liquidityShiftsRight == 0) {
                return (0, 0);
            }
            (, liquidityNet,,,,,,) = IUniswapV3Pool(pool).ticks(tick - i * tickSpacing);
            liquidityShiftsLeft -= liquidityNet;
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

    function _getPool(address token0, address token1, uint24 fee) private pure returns (address) {
        return address(uint160(uint256(
                keccak256(
                    abi.encodePacked(
                        hex'ff',
                        FACTORY,
                        keccak256(abi.encode(token0, token1, fee)),
                        POOL_INIT_CODE_HASH
                    )
                )
            )));
    }
}
