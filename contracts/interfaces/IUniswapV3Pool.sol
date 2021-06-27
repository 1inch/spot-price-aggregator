// SPDX-License-Identifier: MIT

pragma solidity ^0.7.6;

import "./IUniswapV3PoolImmutables.sol";
import "./IUniswapV3PoolState.sol";

/// @title The interface for a Uniswap V3 Pool
/// @notice A Uniswap pool facilitates swapping and automated market making between any two assets that strictly conform
/// to the ERC20 specification
/// @dev The pool interface is broken up into many smaller pieces
interface IUniswapV3Pool is
IUniswapV3PoolImmutables,
IUniswapV3PoolState
{
}
