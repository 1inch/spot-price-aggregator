// SPDX-License-Identifier: MIT

pragma solidity 0.8.14;
pragma abicoder v1;

import "../interfaces/IDodo.sol";
import "../interfaces/IDodoZoo.sol";
import "./OracleBase.sol";

contract DodoOracle is OracleBase {
    IDodoZoo public immutable dodoZoo;
    IERC20 private constant _NONE = IERC20(0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF);
    IDodo private constant _ZERO_DODO = IDodo(0x0000000000000000000000000000000000000000);

    constructor(IDodoZoo _dodoZoo) {
        dodoZoo = _dodoZoo;
    }

    function _getBalances(IERC20 _srcToken, IERC20 _dstToken) internal view override returns (uint256, uint256) {
        address srcToken = address(_srcToken);
        address dstToken = address(_dstToken);

        IDodo dodo = IDodo(dodoZoo.getDODO(srcToken, dstToken));
        bool isSrcBase = (dodo != _ZERO_DODO);
        if (!isSrcBase) dodo = IDodo(dodoZoo.getDODO(dstToken, srcToken));
        require(dodo != _ZERO_DODO, "DO: Dodo not found");

        uint256 balance0 = dodo._BASE_BALANCE_();
        uint256 balance1 = dodo._QUOTE_BALANCE_();

        return isSrcBase? (balance0, balance1) : (balance1, balance0);
    }
}
