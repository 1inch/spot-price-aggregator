// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "../interfaces/IOracle.sol";
import "../interfaces/IDodo.sol";
import "../interfaces/IDodoFactories.sol";

contract DodoOracle is IOracle {
    using Math for uint256;

    IDodoZoo public immutable factory; // dodoZoo
    IERC20 private constant _NONE = IERC20(0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF);
    IDodo private constant _ZERO_DODO = IDodo(0x0000000000000000000000000000000000000000);

    constructor(IDodoZoo _dodoZoo) {
        factory = _dodoZoo;
    }

    function getRate(IERC20 srcToken, IERC20 dstToken, IERC20 connector, uint256 /*thresholdFilter*/) external view override returns (uint256 rate, uint256 weight) {
        uint256 balanceSrc;
        uint256 balanceDst;
        if (connector == _NONE) {
            (rate, balanceSrc, balanceDst) = _getDodoInfo(address(srcToken), address(dstToken));
            weight = (balanceSrc * balanceDst).sqrt();
        } else {
            uint256 balanceConnector0;
            uint256 balanceConnector1;
            uint256 rateSrcConnector;
            uint256 rateConnectorDst;
            (rateSrcConnector, balanceSrc, balanceConnector0) = _getDodoInfo(address(srcToken), address(connector));
            (rateConnectorDst, balanceConnector1, balanceDst) = _getDodoInfo(address(connector), address(dstToken));
            weight = Math.min(balanceSrc * balanceConnector0, balanceDst * balanceConnector1).sqrt();
            rate = Math.mulDiv(rateSrcConnector, rateConnectorDst, 1e18);
        }
    }

    function _getDodoInfo(address srcToken, address dstToken) internal view returns (uint256 rate, uint256 balanceSrc, uint256 balanceDst) {
        IDodo dodo = IDodo(factory.getDODO(srcToken, dstToken));
        bool isSrcBase = (dodo != _ZERO_DODO);
        if (!isSrcBase) dodo = IDodo(factory.getDODO(dstToken, srcToken));
        if(dodo == _ZERO_DODO) revert PoolNotFound();

        uint256 price = dodo.getMidPrice();
        rate = isSrcBase ? price : 1e36 / price;
        uint256 b0 = dodo._BASE_BALANCE_();
        uint256 b1 = dodo._QUOTE_BALANCE_();
        (balanceSrc, balanceDst) = isSrcBase ? (b0, b1) : (b1, b0);
    }
}
