// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import { IChaiPot } from "../interfaces/IChai.sol";
import "./Wrapper.sol";

contract ChaiWrapper is Wrapper {
    uint256 private constant _ONE = 10 ** 27;
    IChaiPot public immutable POT;

    constructor(IERC20 base, IERC20 wBase, IChaiPot pot) Wrapper(base, wBase) {
        POT = pot;
    }

    function _wrap() internal view override returns (IERC20 wrappedToken, uint256 rate) {
        return (WBASE, _rdivup(1e18, POT.chi()));
    }

    function _unwrap() internal view override returns (IERC20 unwrappedToken, uint256 rate) {
        return (BASE, _rmul(POT.chi(), 1e18));
    }

    function _rdivup(uint x, uint y) internal pure returns (uint z) {
        z = (x * _ONE + y - 1) / y;
    }

    function _rmul(uint x, uint y) internal pure returns (uint z) {
        z = x * y / _ONE;
    }
}
