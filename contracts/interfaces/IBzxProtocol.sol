// SPDX-License-Identifier: MIT

pragma solidity ^0.7.6;


interface IBzxProtocol {
    function underlyingToLoanPool(address underlying) external view returns (address loanPool);
}
