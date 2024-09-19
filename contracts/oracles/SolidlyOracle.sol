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
        uint256 srcDecimals = IERC20Metadata(address(srcToken)).decimals();
        uint256 dstDecimals = IERC20Metadata(address(dstToken)).decimals();
        if (connector == _NONE) {
            (rate, weight) = _getWeightedRate(srcToken, dstToken, srcDecimals, dstDecimals, thresholdFilter);
        } else {
            uint256 connectorDecimals = IERC20Metadata(address(connector)).decimals();
            (uint256 rateC0, uint256 weightC0) = _getWeightedRate(srcToken, connector, srcDecimals, connectorDecimals, thresholdFilter);
            (uint256 rateC1, uint256 weightC1) = _getWeightedRate(connector, dstToken, connectorDecimals, dstDecimals, thresholdFilter);
            rate = rateC0 * rateC1 / 1e18;
            weight = Math.min(weightC0, weightC1);
        }
    }

    function _getWeightedRate(IERC20 srcToken, IERC20 dstToken, uint256 srcDecimals, uint256 dstDecimals, uint256 thresholdFilter) internal view returns (uint256 rate, uint256 weight) {
        OraclePrices.Data memory ratesAndWeights = OraclePrices.init(2);
        (uint256 b0, uint256 b1) = _getBalances(srcToken, dstToken, true);
        if (b0 > 0) {
            uint256 _x = (b0 * 1e18) / 10 ** srcDecimals; // b0 converted to 1e18 decimals format
            uint256 _y = (b1 * 1e18) / 10 ** dstDecimals; // b1 converted to 1e18 decimals format
            uint256 _a = (_x * _y) / 1e18;
            uint256 _b = ((_x * _x) / 1e18 + (_y * _y) / 1e18);
            uint256 xy = (_a * _b) / 1e18;

            (uint256 y, bool error) = _getY(1e18 + _x , xy, _y); // calculation for 1 src token converted to 1e18 decimals format
            if (!error) {
                uint256 amountOut = b1 - y / (10 ** (18 - dstDecimals));
                ratesAndWeights.append(OraclePrices.OraclePrice(amountOut, (b0 * b1).sqrt()));
            }
        }
        (b0, b1) = _getBalances(srcToken, dstToken, false);
        if (b0 > 0) {
            ratesAndWeights.append(OraclePrices.OraclePrice(Math.mulDiv(b1, 1e18, b0), (b0 * b1).sqrt()));
        }
        (rate, weight) = ratesAndWeights.getRateAndWeight(thresholdFilter);
    }

    // Helper function to compute 'y' based on the stable swap invariant
    function _getY(uint256 x0, uint256 xy, uint256 y0) internal pure returns (uint256 y, bool error) {
        y = y0;
        for (uint256 i = 0; i < 255; i++) {
            uint256 k = _f(x0, y);
            if (k < xy) {
                uint256 dy = ((xy - k) * 1e18) / _d(x0, y);
                if (dy == 0) {
                    return (y, false);
                }
                y = y + dy;
            } else {
                uint256 dy = ((k - xy) * 1e18) / _d(x0, y);
                if (dy == 0) {
                    return (y, false);
                }
                y = y - dy;
            }
        }
        return (0, true);
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
    function _pairFor(IERC20 tokenA, IERC20 tokenB, bool stable) internal virtual view returns (address pair) {
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
        }
    }
}
