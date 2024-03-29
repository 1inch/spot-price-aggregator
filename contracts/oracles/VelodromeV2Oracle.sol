// SPDX-License-Identifier: MIT
// solhint-disable one-contract-per-file

pragma solidity 0.8.23;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../interfaces/IOracle.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "../libraries/OraclePrices.sol";

interface IVelodramoV2Router {
    function getReserves(address tokenA, address tokenB, bool stable, address _factory) external view returns (uint256 reserveA, uint256 reserveB);
}

interface IVelodramoV2Registry {
    function poolFactories() external view returns (address[] memory);
}


contract VelodromeV2Oracle is IOracle {
    using OraclePrices for OraclePrices.Data;
    using Math for uint256;

    IERC20 private constant _NONE = IERC20(0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF);

    IVelodramoV2Router public immutable ROUTER;
    IVelodramoV2Registry public immutable REGISTRY;

    constructor(IVelodramoV2Router _router, IVelodramoV2Registry _registry) {
        ROUTER = _router;
        REGISTRY = _registry;
    }

    function getRate(IERC20 srcToken, IERC20 dstToken, IERC20 connector, uint256 thresholdFilter) external view override returns (uint256 rate, uint256 weight) {
        address[] memory factories = REGISTRY.poolFactories();
        if (connector == _NONE) {
            (rate, weight) = _getWeightedRate(srcToken, dstToken, factories, thresholdFilter);
        } else {
            (uint256 rateC0, uint256 weightC0) = _getWeightedRate(srcToken, connector, factories, thresholdFilter);
            (uint256 rateC1, uint256 weightC1) = _getWeightedRate(connector, dstToken, factories, thresholdFilter);
            rate = rateC0 * rateC1 / 1e18;
            weight = Math.min(weightC0, weightC1);
        }
    }

    function _getWeightedRate(IERC20 srcToken, IERC20 dstToken, address[] memory factories, uint256 thresholdFilter) internal view returns (uint256 rate, uint256 weight) {
        uint256 factoriesLength = factories.length;
        OraclePrices.Data memory ratesAndWeights = OraclePrices.init(2 * factoriesLength);
        uint256 b0;
        uint256 b1;
        for (uint256 i = 0; i < factoriesLength; i++) {
            (b0, b1) = _getReserves(srcToken, dstToken, true, factories[i]);
            if (b0 > 0) {
                ratesAndWeights.append(OraclePrices.OraclePrice(Math.mulDiv(b1, 1e18, b0), (b0 * b1).sqrt()));
            }
            (b0, b1) = _getReserves(srcToken, dstToken, false, factories[i]);
            if (b0 > 0) {
                ratesAndWeights.append(OraclePrices.OraclePrice(Math.mulDiv(b1, 1e18, b0), (b0 * b1).sqrt()));
            }
        }
        (rate, weight) = ratesAndWeights.getRateAndWeight(thresholdFilter);
    }

    function _getReserves(IERC20 srcToken, IERC20 dstToken, bool stable, address factory) internal view returns (uint256 reserveSrc, uint256 reserveDst) {
        try ROUTER.getReserves(address(srcToken), address(dstToken), stable, factory) returns (uint256 reserveSrc_, uint256 reserveDst_) {
            (reserveSrc, reserveDst) = (reserveSrc_, reserveDst_);
        } catch {}  // solhint-disable-line no-empty-blocks
    }
}
