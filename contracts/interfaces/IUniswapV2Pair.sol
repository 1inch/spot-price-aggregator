// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.19;

interface IUniswapV2Pair {
    function getReserves() external view returns (uint112 _reserve0, uint112 _reserve1, uint32 _blockTimestampLast);
}
