// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "../interfaces/IOracle.sol";
import "../interfaces/IDodo.sol";
import "../interfaces/IDodoFactories.sol";
import "../libraries/Sqrt.sol";

// solhint-disable var-name-mixedcase

contract DodoV2Oracle is IOracle {
    using Sqrt for uint256;

    IDVMFactory public immutable DVMFactory;
    IERC20 private constant _NONE = IERC20(0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF);

    constructor(IDVMFactory _DVMFactory) {
        DVMFactory = _DVMFactory;
    }

    function getRate(IERC20 srcToken, IERC20 dstToken, IERC20 connector) external view override returns (uint256 rate, uint256 weight) {
        if (connector == _NONE) {
            (address[] memory machines, bool isSrcBase) = _getMachines(address(srcToken), address(dstToken));
            for (uint256 i = 0; i < machines.length; i++) {
                IDVM dvm = IDVM(machines[i]);
                (uint256 r, uint256 b0, uint256 b1) = _getDodoInfo(dvm, isSrcBase);
                uint256 w = (b0 * b1).sqrt();
                rate += r * w;
                weight += w;
            }
        } else {
            (address[] memory machines0, bool isSrcBase0) = _getMachines(address(srcToken), address(connector));
            (address[] memory machines1, bool isSrcBase1) = _getMachines(address(connector), address(dstToken));
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
                    rate += r0 * r1 * w / 1e18;
                    weight += w;
                }
            }
        }

        if(weight > 0) {
            unchecked { rate /= weight; }
        }
    }

    function _getMachines(address srcToken, address dstToken) internal view returns (address[] memory machines, bool isSrcBase) {
        machines = DVMFactory.getDODOPool(srcToken, dstToken);
        isSrcBase = (machines.length != 0);
        if (!isSrcBase) machines = DVMFactory.getDODOPool(dstToken, srcToken);
        require(machines.length != 0, "DOV2: machines not found");
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
