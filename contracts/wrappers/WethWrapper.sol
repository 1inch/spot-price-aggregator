// SPDX-License-Identifier: MIT

pragma solidity 0.7.6;

import "../interfaces/IWrapper.sol";


contract WethWrapper is IWrapper {
    IERC20 private constant _ETH = IERC20(0x0000000000000000000000000000000000000000);
    IERC20 private constant _WETH = IERC20(0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2);

    function wrap(IERC20 token) external pure override returns (IERC20 wrappedToken, uint256 rate) {
        if(token == _ETH) {
            return (_WETH, 1e18);
        } else if (token == _WETH) {
            return (_ETH, 1e18);
        } else {
            revert("Unsupported token");
        }
    }
}
