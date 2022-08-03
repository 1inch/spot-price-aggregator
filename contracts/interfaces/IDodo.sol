// SPDX-License-Identifier: MIT

pragma solidity 0.8.14;
pragma abicoder v1;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";


interface IDodo {
    function getExpectedTarget() external view returns (uint256 baseTarget, uint256 quoteTarget);
    function getMidPrice() external view returns (uint256 midPrice);
}

