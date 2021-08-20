// SPDX-License-Identifier: MIT

pragma solidity ^0.7.6;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IClipper {
    function lastBalance(IERC20 token) external view returns (uint256);
}
