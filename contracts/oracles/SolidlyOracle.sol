// SPDX-License-Identifier: MIT

pragma solidity 0.8.23;

import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/interfaces/IERC20Metadata.sol";
import "./OracleBase.sol";
import "../interfaces/IOracle.sol";
import "../interfaces/IUniswapV2Pair.sol";
import "../libraries/OraclePrices.sol";

contract SolidlyOracle is IOracle {
    using OraclePrices for OraclePrices.Data;
    using Math for uint256;

    address public immutable FACTORY;
    bytes32 public immutable INITCODE_HASH;

    IERC20 private constant _NONE = IERC20(0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF);

    constructor(address _factory, bytes32 _initcodeHash) {
        FACTORY = _factory;
        INITCODE_HASH = _initcodeHash;
    }

    function getRate(IERC20 srcToken, IERC20 dstToken, IERC20 connector, uint256 thresholdFilter) external view override returns (uint256 rate, uint256 weight) {
        if (connector == _NONE) {
            (rate, weight) = _getWeightedRate(srcToken, dstToken, thresholdFilter);
        } else {
            (uint256 rateC0, uint256 weightC0) = _getWeightedRate(srcToken, connector, thresholdFilter);
            (uint256 rateC1, uint256 weightC1) = _getWeightedRate(connector, dstToken, thresholdFilter);
            rate = rateC0 * rateC1 / 1e18;
            weight = Math.min(weightC0, weightC1);
        }
    }

    function _getWeightedRate(IERC20 srcToken, IERC20 dstToken, uint256 thresholdFilter) internal view returns (uint256 rate, uint256 weight) {
        OraclePrices.Data memory ratesAndWeights = OraclePrices.init(2);
        (uint256 b0, uint256 b1) = _getBalances(srcToken, dstToken, true);
        if (b0 > 0) {
            // Get decimals for both tokens
            uint256 decimalsSrc = IERC20Metadata(address(srcToken)).decimals();
            uint256 decimalsDst = IERC20Metadata(address(dstToken)).decimals();

            //uint256 adjustedB0 = b0 * (10 ** (18 - decimalsSrc));
            //uint256 adjustedB1 = b1 * (10 ** (18 - decimalsDst));

            // Calculate the 'k' value using the stable swap formula
            uint256 _a = (b0 * b1) / 1e18;
            uint256 _b = ((b0 * b0) / 1e18 + (b1 * b1) / 1e18);
            uint256 xy = (_a * _b) / 1e18;

            // Set 1 amountIn minus stable fee for basic stable pools
            uint256 amountIn = (10 ** decimalsSrc) * (10000 - 5) / 10000;


            // Compute y using the stable swap invariant
            uint256 y = _getY(amountIn + b0, xy, b1);

            // Calculate amountOut
            uint256 dy = b1 - y;

            // Adjust dy back to token decimals
            uint256 amountOut = dy / (10 ** (18 - decimalsDst));

            ratesAndWeights.append(OraclePrices.OraclePrice(
                (amountOut * 1e18) / amountIn,
                (b0 * b1).sqrt()
            ));


        }
        (b0, b1) = _getBalances(srcToken, dstToken, false);
        if (b0 > 0) {
            ratesAndWeights.append(OraclePrices.OraclePrice(Math.mulDiv(b1, 1e18, b0), (b0 * b1).sqrt()));
        }
        (rate, weight) = ratesAndWeights.getRateAndWeight(thresholdFilter);
    }

    // Helper function to compute 'y' based on the stable swap invariant
    function _getY(uint256 x0, uint256 xy, uint256 y0) internal pure returns (uint256) {
        uint256 y = y0;
        for (uint256 i = 0; i < 255; i++) {
            uint256 k = _f(x0, y);
            if (k < xy) {
                uint256 dy = ((xy - k) * 1e18) / _d(x0, y);
                if (dy == 0) {
                    return y;
                }
                y = y + dy;
            } else {
                uint256 dy = ((k - xy) * 1e18) / _d(x0, y);
                if (dy == 0) {
                    return y;
                }
                y = y - dy;
            }
        }
        revert("!y"); // error comes from the original code
    }

    // Internal functions '_f' and '_d' as per the original code
    function _f(uint256 x0, uint256 y) internal pure returns (uint256) {
        uint256 _a = (x0 * y) / 1e18;
        uint256 _b = ((x0 * x0) / 1e18 + (y * y) / 1e18);
        return (_a * _b) / 1e18;
    }

    function _d(uint256 x0, uint256 y) internal pure returns (uint256) {
        return (3 * x0 * ((y * y) / 1e18)) / 1e18 + ((((x0 * x0) / 1e18) * x0) / 1e18);
    }

    // calculates the CREATE2 address for a pair without making any external calls
    function _pairFor(IERC20 tokenA, IERC20 tokenB, bool stable) private view returns (address pair) {
        pair = address(uint160(uint256(keccak256(abi.encodePacked(
                hex"ff",
                FACTORY,
                keccak256(abi.encodePacked(tokenA, tokenB, stable)),
                INITCODE_HASH
            )))));
    }

    function _getBalances(IERC20 srcToken, IERC20 dstToken, bool stable) internal view returns (uint256 srcBalance, uint256 dstBalance) {
        (IERC20 token0, IERC20 token1) = srcToken < dstToken ? (srcToken, dstToken) : (dstToken, srcToken);
        (bool success, bytes memory data) = _pairFor(token0, token1, stable).staticcall(abi.encodeWithSelector(IUniswapV2Pair.getReserves.selector));
        if (success && data.length == 96) {
            (srcBalance, dstBalance) = abi.decode(data, (uint256, uint256));
            (srcBalance, dstBalance) = srcToken == token0 ? (srcBalance, dstBalance) : (dstBalance, srcBalance);
        } else {
            (srcBalance, dstBalance) = (1, 0);
        }
    }
}
