// SPDX-License-Identifier: MIT

pragma solidity ^0.7.6;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";


interface IKyberDmmRouter {
    function factory() external pure returns (address);

    function quote(uint256 amountA, uint256 reserveA, uint256 reserveB) external pure returns (uint256 amountB);

    function getAmountsOut(uint256 amountIn, address[] calldata poolsPath, IERC20[] calldata path) external view returns (uint256[] memory amounts);

    function getAmountsIn(uint256 amountOut, address[] calldata poolsPath, IERC20[] calldata path) external view returns (uint256[] memory amounts);
}
