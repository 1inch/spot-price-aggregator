// SPDX-License-Identifier: MIT

pragma solidity 0.8.9;
pragma abicoder v1;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";


interface IMooniswap {
    function getTokens() external view returns(IERC20[] memory tokens);
}
