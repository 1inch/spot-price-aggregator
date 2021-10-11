// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;
pragma abicoder v1;


interface IKyberDmmPool {
    function getTradeInfo() external view returns (uint112 reserve0, uint112 reserve1, uint112 _vReserve0, uint112 _vReserve1, uint256 feeInPrecision);
}
