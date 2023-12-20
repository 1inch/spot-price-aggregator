// SPDX-License-Identifier: MIT

pragma solidity 0.8.23;

import "../interfaces/ISDai.sol";
import "./Wrapper.sol";

contract SDaiWrapper is Wrapper {
    constructor(IERC20 base, IERC20 wBase) Wrapper(base, wBase) {} // solhint-disable-line no-empty-blocks

    function _wrap() internal view override returns (IERC20 wrappedToken, uint256 rate) {
        return (WBASE, ISDai(address(WBASE)).previewDeposit(1e18));
    }

    function _unwrap() internal view override returns (IERC20 unwrappedToken, uint256 rate) {
        return (BASE, ISDai(address(WBASE)).previewRedeem(1e18));
    }
}
