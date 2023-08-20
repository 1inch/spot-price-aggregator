// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import "../interfaces/IWrapper.sol";

contract BaseCoinWrapper is IWrapper {
    IERC20 public immutable BASE;
    IERC20 public immutable WBASE;

    constructor(IERC20 base, IERC20 wBase) {
        BASE = base;
        WBASE = wBase;
    }

    function wrap(IERC20 token) external view override returns (IERC20 wrappedToken, uint256 rate) {
        if(token == BASE) {
            return _wrap();
        } else if (token == WBASE) {
            return _unwrap();
        } else {
            revert NotSupportedToken();
        }
    }

    function _wrap() internal view virtual returns (IERC20 wrappedToken, uint256 rate) {
        return (WBASE, 1e18);
    }

    function _unwrap() internal view virtual returns (IERC20 unwrappedToken, uint256 rate) {
        return (BASE, 1e18);
    }
}
