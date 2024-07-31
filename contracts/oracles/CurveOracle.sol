// SPDX-License-Identifier: MIT

pragma solidity 0.8.23;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "../interfaces/IOracle.sol";
import "../interfaces/ICurveProvider.sol";
import "../interfaces/ICurveRegistry.sol";
import "../interfaces/ICurveSwap.sol";
import "../libraries/OraclePrices.sol";
import "../helpers/Blacklist.sol";

interface ICurveRateProvider {
    struct Quote {
        uint256 source_token_index;
        uint256 dest_token_index;
        bool is_underlying;
        uint256 amount_out;
        address pool;
        uint256 source_token_pool_balance;
        uint256 dest_token_pool_balance;
        uint8 pool_type; // 0 for stableswap, 1 for cryptoswap, 2 for LLAMMA.
    }

    function get_quotes (address source_token, address destination_token, uint256 amount_in) external view returns (ICurveRateProvider.Quote[] memory quote);
}


contract CurveOracle is IOracle {
    using OraclePrices for OraclePrices.Data;
    using Math for uint256;

    IERC20 private constant _NONE = IERC20(0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF);
    IERC20 private constant _ETH = IERC20(0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE);

    ICurveRateProvider public immutable CURVE_RATE_PROVIDER;

    constructor(ICurveRateProvider curveRateProvider) {
        CURVE_RATE_PROVIDER = curveRateProvider;
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
        for (uint256 i = 0; i < quotes.length; i++) {
            if (quotes[i].amount_out > 0) {
                rate = quotes[i].amount_out * 1e18 / amountIn;
                weight = (quotes[i].source_token_pool_balance * quotes[i].dest_token_pool_balance).sqrt();
                ratesAndWeights.append(OraclePrices.OraclePrice(rate, weight));
            }
        }
        return ratesAndWeights.getRateAndWeight(thresholdFilter);
    }
}
