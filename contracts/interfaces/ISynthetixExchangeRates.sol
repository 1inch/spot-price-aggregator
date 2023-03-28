// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

interface ISynthetixExchangeRates {
    function rateAndInvalid(bytes32 currencyKey) external view returns (uint256 rate, bool isInvalid);
}
