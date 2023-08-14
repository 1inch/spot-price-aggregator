// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import "../interfaces/IWrapper.sol";

contract BaseCoinWrapper is IWrapper {
    IERC20 private constant _BASE = IERC20(0x0000000000000000000000000000000000000000);
    IERC20 private immutable _WBASE;

    constructor(IERC20 wBase) {
        _WBASE = wBase;
    }

    function wrap(IERC20 token) external view override returns (IERC20 wrappedToken, uint256 rate) {
        if(token == _BASE) {
            return (_WBASE, 1e18);
        } else if (token == _WBASE) {
            return (_BASE, 1e18);
        } else {
            revert NotSupportedToken();
        }
    }
}
