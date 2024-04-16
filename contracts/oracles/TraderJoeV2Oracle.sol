// SPDX-License-Identifier: MIT

pragma solidity 0.8.23;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "../interfaces/IOracle.sol";
import "../interfaces/ITraderJoeV2Factory.sol";
import "../interfaces/ITraderJoeV2Pool.sol";
import "../libraries/OraclePrices.sol";

contract TraderJoeV2Oracle is IOracle {
    using OraclePrices for OraclePrices.Data;
    using Math for uint256;

    ITraderJoeV2Factory public immutable FACTORY;

    constructor(ITraderJoeV2Factory _factory) {
        FACTORY = _factory;
    }

    IERC20 private constant _NONE = IERC20(0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF);

    function getRate(IERC20 srcToken, IERC20 dstToken, IERC20 connector, uint256 thresholdFilter) external override view returns (uint256 rate, uint256 weight) {
        OraclePrices.Data memory ratesAndWeights;
        if (connector == _NONE) {
            ITraderJoeV2Factory.LBPairInformation[] memory pools = FACTORY.getAllLBPairs(srcToken, dstToken);

            if(pools.length == 0) revert PoolNotFound();

            ratesAndWeights = OraclePrices.init(pools.length);
            for (uint256 i = 0; i < pools.length; i++) {
                (uint256 b0, uint256 b1) = _getBalances(srcToken, dstToken, pools[i].LBPair);
                if (b0 == 0 || b1 == 0) continue;
                ratesAndWeights.append(OraclePrices.OraclePrice(Math.mulDiv(b1, 1e18, b0), (b0 * b1).sqrt()));
            }
        } else {
            ITraderJoeV2Factory.LBPairInformation[] memory pools0 = FACTORY.getAllLBPairs(srcToken, connector);
            ITraderJoeV2Factory.LBPairInformation[] memory pools1 = FACTORY.getAllLBPairs(connector, dstToken);

            if(pools0.length == 0 || pools1.length == 0) revert PoolWithConnectorNotFound();

            ratesAndWeights = OraclePrices.init(pools0.length * pools1.length);
            for (uint256 i = 0; i < pools0.length; i++) {
                for (uint256 j = 0; j < pools1.length; j++) {
                    (uint256 b0, uint256 bc0) = _getBalances(srcToken, connector, pools0[i].LBPair);
                    (uint256 bc1, uint256 b1) = _getBalances(connector, dstToken, pools1[j].LBPair);
                    uint256 w = Math.min(b0 * bc0, b1 * bc1).sqrt();
                    ratesAndWeights.append(OraclePrices.OraclePrice(Math.mulDiv(b1 * bc0, 1e18, bc1 * b0), w));
                }
            }
        }
        return ratesAndWeights.getRateAndWeight(thresholdFilter);
    }

    function _getBalances(IERC20 srcToken, IERC20 dstToken, address pool) private view returns (uint256 srcBalance, uint256 dstBalance) {
        (srcBalance, dstBalance) = ITraderJoeV2Pool(pool).getReserves();
        if (srcToken > dstToken) {
            (srcBalance, dstBalance) = (dstBalance, srcBalance);
        }
    }
}
