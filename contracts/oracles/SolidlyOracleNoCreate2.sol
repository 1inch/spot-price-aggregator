// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import "@openzeppelin/contracts/utils/math/Math.sol";
import "./OracleBase.sol";
import "../interfaces/ISolidlyFactory.sol";
import "../interfaces/IOracle.sol";
import "../interfaces/IUniswapV2Pair.sol";
import "../libraries/OraclePrices.sol";

contract SolidlyOracleNoCreate2 is IOracle {
    using OraclePrices for OraclePrices.Data;
    using Math for uint256;

    ISolidlyFactory public immutable factory;

    IERC20 private constant _NONE = IERC20(0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF);

    constructor(ISolidlyFactory _factory) {
        factory = _factory;
    }

    function getRate(IERC20 srcToken, IERC20 dstToken, IERC20 connector, uint256 thresholdFilter) external view override returns (uint256 rate, uint256 weight) {
        if(connector != _NONE) revert ConnectorShouldBeNone();
        OraclePrices.Data memory ratesAndWeights = OraclePrices.init(2);
        (uint256 b0, uint256 b1) = _getBalances(srcToken, dstToken, true);
        ratesAndWeights.append(OraclePrices.OraclePrice(Math.mulDiv(b1, 1e18, b0), (b0 * b1).sqrt()));
        (b0, b1) = _getBalances(srcToken, dstToken, false);
        ratesAndWeights.append(OraclePrices.OraclePrice(Math.mulDiv(b1, 1e18, b0), (b0 * b1).sqrt()));
        return ratesAndWeights.getRateAndWeight(thresholdFilter);

    }

    function _getBalances(IERC20 srcToken, IERC20 dstToken, bool stable) internal view returns (uint256 srcBalance, uint256 dstBalance) {
        (IERC20 token0, IERC20 token1) = srcToken < dstToken ? (srcToken, dstToken) : (dstToken, srcToken);
        (uint256 reserve0, uint256 reserve1,) = IUniswapV2Pair(factory.getPair(token0, token1, stable)).getReserves();
        (srcBalance, dstBalance) = srcToken == token0 ? (reserve0, reserve1) : (reserve1, reserve0);
    }
}
