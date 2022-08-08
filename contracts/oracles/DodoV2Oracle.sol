// SPDX-License-Identifier: MIT

pragma solidity 0.8.15;
pragma abicoder v1;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
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
        uint256 balanceSrc;
        uint256 balanceDst;
        if (connector == _NONE) {
            (rate, balanceSrc, balanceDst) = _getDodoInfo(srcToken, dstToken);
        } else {
            uint256 balanceConnector0;
            uint256 balanceConnector1;
            uint256 rateSrcConnector;
            uint256 rateConnectorDst;
            (rateSrcConnector, balanceSrc, balanceConnector0) = _getDodoInfo(srcToken, connector);
            (rateConnectorDst, balanceConnector1, balanceDst) = _getDodoInfo(connector, dstToken);
            if (balanceConnector0 > balanceConnector1) {
                balanceSrc = balanceSrc * balanceConnector1 / balanceConnector0;
            } else {
                balanceDst = balanceDst * balanceConnector0 / balanceConnector1;
            }
            rate = rateSrcConnector * rateConnectorDst / 1e18;
        }

        weight = (balanceSrc * balanceDst).sqrt();
    }

    function _getDodoInfo(IERC20 _srcToken, IERC20 _dstToken) internal view returns (uint256 rate, uint256 balanceSrc, uint256 balanceDst) {
        address srcToken = address(_srcToken);
        address dstToken = address(_dstToken);
        address[] memory machines = DVMFactory.getDODOPool(srcToken, dstToken);
        bool isSrcBase = (machines.length != 0);
        if (!isSrcBase) machines = DVMFactory.getDODOPool(dstToken, srcToken);
        require(machines.length != 0, "DOV2: machines not found");

        for (uint256 i = 0; i < machines.length; i++) {
            IDVM dvm = IDVM(machines[i]);
            uint256 b0 = dvm._BASE_RESERVE_();
            uint256 b1 = dvm._QUOTE_RESERVE_();
            if (b0 != 0 && b1 != 0) {
                uint256 price = dvm.getMidPrice();
                uint256 w = b0 * b1;
                rate += isSrcBase? price * w : 1e36 / price * w;
                balanceSrc += isSrcBase? b0 : b1;
                balanceDst += isSrcBase? b1 : b0;
            }
        }

        if(balanceSrc > 0 && balanceDst > 0) {
            rate /= (balanceSrc * balanceDst);
        }
    }
}
