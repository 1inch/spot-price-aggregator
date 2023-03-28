// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface ISolidlyFactory {
    function getPair(IERC20 tokenA, IERC20 tokenB, bool stable) external view returns (address pair);
}
