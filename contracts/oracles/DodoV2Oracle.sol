// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "../interfaces/IDodo.sol";
import "../interfaces/IDodoFactories.sol";
import "../interfaces/IOracle.sol";
import "../libraries/OraclePrices.sol";

// solhint-disable var-name-mixedcase

contract DodoV2Oracle is IOracle {
    using OraclePrices for OraclePrices.Data;
    using Math for uint256;

    IDVMFactory public immutable factory; // DVMFactory
    IERC20 private constant _NONE = IERC20(0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF);

    constructor(IDVMFactory _DVMFactory) {
        factory = _DVMFactory;
    }

    function getRate(IERC20 srcToken, IERC20 dstToken, IERC20 connector, uint256 thresholdFilter) external view override returns (uint256 rate, uint256 weight) {
        OraclePrices.Data memory ratesAndWeights;
        if (connector == _NONE) {
            (address[] memory machines, bool isSrcBase) = _getMachines(address(srcToken), address(dstToken));
            ratesAndWeights = OraclePrices.init(machines.length);
            for (uint256 i = 0; i < machines.length; i++) {
                IDVM dvm = IDVM(machines[i]);
                (uint256 r, uint256 b0, uint256 b1) = _getDodoInfo(dvm, isSrcBase);
                ratesAndWeights.append(OraclePrices.OraclePrice(r, (b0 * b1).sqrt()));
            }
        } else {
            (address[] memory machines0, bool isSrcBase0) = _getMachines(address(srcToken), address(connector));
            (address[] memory machines1, bool isSrcBase1) = _getMachines(address(connector), address(dstToken));
            ratesAndWeights = OraclePrices.init(machines0.length * machines1.length);
            for (uint256 i = 0; i < machines0.length; i++) {
                (uint256 r0, uint256 b0, uint256 bc0) = _getDodoInfo(IDVM(machines0[i]), isSrcBase0);
                if (b0 == 0 || bc0 == 0) {
                    continue;
                }
                for (uint256 j = 0; j < machines1.length; j++) {
                    (uint256 r1, uint256 bc1, uint256 b1) = _getDodoInfo(IDVM(machines1[j]), isSrcBase1);
                    if (b1 == 0 || bc1 == 0) {
                        continue;
                    }
                    uint256 w = Math.min(b0 * bc0, b1 * bc1).sqrt();
                    ratesAndWeights.append(OraclePrices.OraclePrice(Math.mulDiv(r0, r1, 1e18), w));
                }
            }
        }
        return ratesAndWeights.getRateAndWeight(thresholdFilter);
    }

    function _getMachines(address srcToken, address dstToken) internal view returns (address[] memory machines, bool isSrcBase) {
        machines = factory.getDODOPool(srcToken, dstToken);
        isSrcBase = (machines.length != 0);
        if (!isSrcBase) machines = factory.getDODOPool(dstToken, srcToken);
        if(machines.length == 0) revert PoolNotFound();
    }

    function _getDodoInfo(IDVM dvm, bool isSrcBase) internal view returns (uint256 rate, uint256 balanceSrc, uint256 balanceDst) {
            uint256 b0 = dvm._BASE_RESERVE_();
            uint256 b1 = dvm._QUOTE_RESERVE_();
            if (b0 != 0 && b1 != 0) {
                uint256 price = dvm.getMidPrice();
                rate += isSrcBase ? price : 1e36 / price;
                (balanceSrc, balanceDst) = isSrcBase ? (b0, b1) : (b1, b0);
            }
        }
}
