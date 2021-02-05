// SPDX-License-Identifier: MIT

pragma solidity ^0.7.6;


interface ILoanToken {
    function tokenPrice() external view returns (uint256 price);
    function loanTokenAddress() external view returns (address underlying);
}
