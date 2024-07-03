// SPDX-License-Identifier: MIT

pragma solidity 0.8.23;

interface IAlgebraPool {
    function globalState() external view returns (uint160 sqrtPriceX96, int24 tick); // returns reduced because forks use different types of returned values that we do not use
}
