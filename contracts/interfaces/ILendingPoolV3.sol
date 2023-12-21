// SPDX-License-Identifier: MIT

pragma solidity 0.8.23;

// AaveProtocolDataProvider
interface ILendingPoolV3 {
    function getReserveTokensAddresses(address asset) external view returns (address aTokenAddress, address stableDebtTokenAddress, address variableDebtTokenAddress);

    struct TokenData {
        string symbol;
        address tokenAddress;
    }

    function getAllReservesTokens() external view returns (TokenData[] memory);
}
