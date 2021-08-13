// SPDX-License-Identifier: MIT

pragma solidity ^0.7.6;

interface ISynthetixExchangeRates {
    function rateAndUpdatedTime(bytes32 currencyKey) external view returns (uint256 rate, uint256 time);
}
