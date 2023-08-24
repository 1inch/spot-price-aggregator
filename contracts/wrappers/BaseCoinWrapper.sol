// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import "./Wrapper.sol";

contract BaseCoinWrapper is Wrapper {
    constructor(IERC20 base, IERC20 wBase) Wrapper(base, wBase) {} // solhint-disable-line no-empty-blocks

    function _wrap() internal view virtual override returns (IERC20 wrappedToken, uint256 rate) {
        return (WBASE, 1e18);
    }

    function _unwrap() internal view virtual override returns (IERC20 unwrappedToken, uint256 rate) {
        return (BASE, 1e18);
    }
}
