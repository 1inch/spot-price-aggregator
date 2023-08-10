// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "../interfaces/IOracle.sol";
import "../interfaces/IKyberDmmFactory.sol";
import "../interfaces/IKyberDmmPool.sol";
import "../libraries/OraclePrices.sol";

contract KyberDmmOracle is IOracle {
    using OraclePrices for OraclePrices.Data;
    using Math for uint256;

    IKyberDmmFactory public immutable factory;

    constructor(IKyberDmmFactory _factory) {
        factory = _factory;
    }

    IERC20 private constant _NONE = IERC20(0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF);

    function getRate(IERC20 srcToken, IERC20 dstToken, IERC20 connector, uint256 thresholdFilter) external override view returns (uint256 rate, uint256 weight) {
        OraclePrices.Data memory ratesAndWeights;
        if (connector == _NONE) {
            address[] memory pools = factory.getPools(srcToken, dstToken);

            if(pools.length == 0) revert PoolNotFound();

            ratesAndWeights = OraclePrices.init(pools.length);
            for (uint256 i = 0; i < pools.length; i++) {
                (uint256 b0, uint256 b1) = _getBalances(srcToken, dstToken, pools[i]);
                ratesAndWeights.append(OraclePrices.OraclePrice(Math.mulDiv(b1, 1e18, b0), (b0 * b1).sqrt()));
            }
        } else {
            address[] memory pools0 = factory.getPools(srcToken, connector);
            address[] memory pools1 = factory.getPools(connector, dstToken);

            if(pools0.length == 0 || pools1.length == 0) revert PoolWithConnectorNotFound();

            ratesAndWeights = OraclePrices.init(pools0.length * pools1.length);
            for (uint256 i = 0; i < pools0.length; i++) {
                for (uint256 j = 0; j < pools1.length; j++) {
                    (uint256 b0, uint256 bc0) = _getBalances(srcToken, connector, pools0[i]);
                    (uint256 bc1, uint256 b1) = _getBalances(connector, dstToken, pools1[j]);
                    uint256 w = Math.min(b0 * bc0, b1 * bc1).sqrt();
                    ratesAndWeights.append(OraclePrices.OraclePrice(Math.mulDiv(b1 * bc0, 1e18, bc1 * b0), w));
                }
            }
        }
        return ratesAndWeights.getRateAndWeight(thresholdFilter);
    }

    function _getBalances(IERC20 srcToken, IERC20 dstToken, address pool) private view returns (uint256 srcBalance, uint256 dstBalance) {
        (, , srcBalance, dstBalance,) = IKyberDmmPool(pool).getTradeInfo();
        if (srcToken > dstToken) {
            (srcBalance, dstBalance) = (dstBalance, srcBalance);
        }
    }
}
