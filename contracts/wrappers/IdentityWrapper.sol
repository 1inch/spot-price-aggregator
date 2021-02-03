// SPDX-License-Identifier: MIT

pragma solidity 0.7.6;

import "../interfaces/IWrapper.sol";


contract IdentityWrapper is IWrapper {
    function wrap(IERC20 token) external pure override returns (IERC20 wrappedToken, uint256 rate) {
        return (token, 1e18);
    }
}
