// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import "../interfaces/IWstETH.sol";
import "./BaseCoinWrapper.sol";

contract WstETHWrapper is BaseCoinWrapper {
    constructor(IERC20 base, IERC20 wBase) BaseCoinWrapper(base, wBase) {} // solhint-disable-line no-empty-blocks

    function _wrap() internal view override returns (IERC20 wrappedToken, uint256 rate) {
        return (WBASE, IWstETH(address(WBASE)).tokensPerStEth());
    }

    function _unwrap() internal view override returns (IERC20 unwrappedToken, uint256 rate) {
        return (BASE, IWstETH(address(WBASE)).stEthPerToken());
    }
}
