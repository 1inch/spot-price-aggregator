// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.11;
pragma abicoder v1;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";


interface IUniswapFactory {
    function getExchange(IERC20 token) external view returns (address exchange);
}
