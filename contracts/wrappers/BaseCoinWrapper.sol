// SPDX-License-Identifier: MIT

pragma solidity 0.8.10;
pragma abicoder v1;

import "../interfaces/IWrapper.sol";


contract BaseCoinWrapper is IWrapper {
    IERC20 private constant _BASE = IERC20(0x0000000000000000000000000000000000000000);
    IERC20 private immutable _wBase;

    constructor(IERC20 wBase) {
        _wBase = wBase;
    }

    function wrap(IERC20 token) external view override returns (IERC20 wrappedToken, uint256 rate) {
        if(token == _BASE) {
            return (_wBase, 1e18);
        } else if (token == _wBase) {
            return (_BASE, 1e18);
        } else {
            revert("Unsupported token");
        }
    }
}
