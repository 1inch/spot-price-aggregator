// SPDX-License-Identifier: MIT

pragma solidity 0.8.23;

import "../interfaces/IWstETH.sol";
import "./Wrapper.sol";

contract WstETHWrapper is Wrapper {
    constructor(IERC20 base, IERC20 wBase) Wrapper(base, wBase) {} // solhint-disable-line no-empty-blocks

    function _wrap() internal view override returns (IERC20 wrappedToken, uint256 rate) {
        return (WBASE, IWstETH(address(WBASE)).tokensPerStEth());
    }

    function _unwrap() internal view override returns (IERC20 unwrappedToken, uint256 rate) {
        return (BASE, IWstETH(address(WBASE)).stEthPerToken());
    }
}
