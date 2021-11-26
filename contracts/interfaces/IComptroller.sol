// SPDX-License-Identifier: MIT

pragma solidity 0.8.10;
pragma abicoder v1;

import "./ICToken.sol";


interface IComptroller {
    function getAllMarkets() external view returns (ICToken[] memory);
    function markets(ICToken market) external view returns (bool isListed, uint256 collateralFactorMantissa, bool isComped);
}
