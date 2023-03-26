// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.15;
pragma abicoder v1;


interface IUniswapV2Factory {
    function INIT_CODE_PAIR_HASH() external view returns (bytes32);
}
