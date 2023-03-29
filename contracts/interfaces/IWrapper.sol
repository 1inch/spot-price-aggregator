// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IWrapper {
    error NotSupportedToken(string wrapper);
    error NotAddedMarket(string wrapper);
    error NotRemovedMarket(string wrapper);

    function wrap(IERC20 token) external view returns (IERC20 wrappedToken, uint256 rate);
}
