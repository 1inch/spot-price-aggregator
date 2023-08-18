// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

interface ISDai {
    function previewDeposit(uint256 assets) external view returns (uint256);
    function previewRedeem(uint256 shares) external view returns (uint256);
}

