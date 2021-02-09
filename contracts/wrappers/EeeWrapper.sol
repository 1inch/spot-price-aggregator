// SPDX-License-Identifier: MIT

pragma solidity 0.7.6;

import "../interfaces/IWrapper.sol";


contract EeeWrapper is IWrapper {
    IERC20 private constant _ETH = IERC20(0x0000000000000000000000000000000000000000);
    IERC20 private constant _EEE = IERC20(0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE);

    function wrap(IERC20 token) external pure override returns (IERC20 wrappedToken, uint256 rate) {
        if(token == _ETH) {
            return (_EEE, 1e18);
        } else if (token == _EEE) {
            return (_ETH, 1e18);
        } else {
            revert("Unsupported token");
        }
    }
}
