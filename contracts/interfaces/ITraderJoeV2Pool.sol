// SPDX-License-Identifier: MIT

pragma solidity 0.8.23;

interface ITraderJoeV2Pool {
    function getReserves() external view returns (uint128 reserveX, uint128 reserveY);
}
