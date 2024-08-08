// SPDX-License-Identifier: MIT

pragma solidity 0.8.23;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "../interfaces/IOracle.sol";
import "../interfaces/ICurveProvider.sol";
import "../libraries/OraclePrices.sol";

contract CurveOracleCRP is IOracle {
    using OraclePrices for OraclePrices.Data;
    using Math for uint256;

    IERC20 private constant _NONE = IERC20(0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF);
    IERC20 private constant _ETH = IERC20(0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE);
    uint256 private constant _RATE_PROVIDER_ID = 18;

    ICurveRateProvider public immutable CURVE_RATE_PROVIDER;
    uint256 public immutable MAX_POOLS;

    constructor(ICurveProvider curveProvider, uint256 maxPools) {
        CURVE_RATE_PROVIDER = ICurveRateProvider(curveProvider.get_address(_RATE_PROVIDER_ID));
        MAX_POOLS = maxPools;
    }

    function getRate(IERC20 srcToken, IERC20 dstToken, IERC20 connector, uint256 thresholdFilter) external view override returns (uint256 rate, uint256 weight) {
        if(connector != _NONE) revert ConnectorShouldBeNone();
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
