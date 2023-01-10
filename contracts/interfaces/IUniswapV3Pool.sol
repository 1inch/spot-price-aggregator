// SPDX-License-Identifier: MIT

pragma solidity 0.8.15;
pragma abicoder v1;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";


interface IUniswapV3Pool {
    function slot0() external view returns (uint160 sqrtPriceX96, int24, uint16, uint16, uint16, uint8, bool);
    function ticks(int24 tick) external view returns (uint128, int128, uint256, uint256, int56, uint160, uint32, bool);
    function tickSpacing() external view returns (int24);
    function token0() external view returns (IERC20 token);
    function liquidity() external view returns (uint128);
}
