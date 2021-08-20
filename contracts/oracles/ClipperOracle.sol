// SPDX-License-Identifier: MIT

pragma solidity 0.7.6;

import "./OracleBase.sol";
import "../interfaces/IClipper.sol";

contract ClipperOracle is OracleBase {
    IClipper public immutable clipper;

    constructor(IClipper _clipper) {
        clipper = _clipper;
    }

    function _getBalances(IERC20 srcToken, IERC20 dstToken) internal view override returns (uint256, uint256) {
        return (clipper.lastBalance(srcToken), clipper.lastBalance(dstToken));
    }
}
