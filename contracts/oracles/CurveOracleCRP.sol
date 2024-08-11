// SPDX-License-Identifier: MIT

pragma solidity 0.8.23;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "../interfaces/IOracle.sol";
import "../interfaces/ICurveProvider.sol";
import "../libraries/OraclePrices.sol";
import "../helpers/ConnectorManager.sol";

contract CurveOracleCRP is IOracle, ConnectorManager {
    using OraclePrices for OraclePrices.Data;
    using Math for uint256;

    error ConnectorNotSupported();

    IERC20 private constant _ETH = IERC20(0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE);
    uint256 private constant _RATE_PROVIDER_ID = 18;

    ICurveRateProvider public immutable CURVE_RATE_PROVIDER;
    uint256 public immutable MAX_POOLS;

    constructor(ICurveProvider curveProvider, uint256 maxPools, IERC20[] memory connectors, address owner)
        ConnectorManager(connectors, owner)
    {
        CURVE_RATE_PROVIDER = ICurveRateProvider(curveProvider.get_address(_RATE_PROVIDER_ID));
        MAX_POOLS = maxPools;
    }

    function getRate(IERC20 srcToken, IERC20 dstToken, IERC20 connector, uint256 thresholdFilter) external view override returns (uint256 rate, uint256 weight) {
        if (!connectorSupported[connector]) revert ConnectorNotSupported();

        if (connector == _NONE) {
            (rate, weight) = _getRate(srcToken, dstToken, thresholdFilter);
        } else {
            (uint256 rate1, uint256 weight1) = _getRate(srcToken, connector, thresholdFilter);
            (uint256 rate2, uint256 weight2) = _getRate(connector, dstToken, thresholdFilter);
            rate = Math.mulDiv(rate1, rate2, 1e18);
            weight = Math.min(weight1, weight2).sqrt();
        }
    }

    function _getRate(IERC20 srcToken, IERC20 dstToken, uint256 thresholdFilter) private view returns (uint256 rate, uint256 weight) {
        uint256 amountIn;
        if (srcToken == _ETH) {
            amountIn = 10**18;
        } else {
            amountIn = 10**IERC20Metadata(IERC20Metadata(address(srcToken))).decimals();
        }
        ICurveRateProvider.Quote[] memory quotes = CURVE_RATE_PROVIDER.get_quotes(address(srcToken), address(dstToken), amountIn);

        OraclePrices.Data memory ratesAndWeights = OraclePrices.init(quotes.length);
        for (uint256 i = 0; i < quotes.length && ratesAndWeights.size < MAX_POOLS; i++) {
            if (quotes[i].amount_out > 0) {
                rate = quotes[i].amount_out * 1e18 / amountIn;
                weight = (quotes[i].source_token_pool_balance * quotes[i].dest_token_pool_balance).sqrt();
                ratesAndWeights.append(OraclePrices.OraclePrice(rate, weight));
            }
        }
        return ratesAndWeights.getRateAndWeight(thresholdFilter);
    }
}
