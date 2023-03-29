// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface ICToken is IERC20 {
    function underlying() external view returns (IERC20 token);
    function exchangeRateStored() external view returns (uint256 exchangeRate);
}
