// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IWrapper {
    function wrap(IERC20 token) external view returns (IERC20 wrappedToken, uint256 rate);
}
