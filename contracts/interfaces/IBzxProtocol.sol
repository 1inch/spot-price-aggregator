// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

interface IBzxProtocol {
    function underlyingToLoanPool(address underlying) external view returns (address loanPool);
}
