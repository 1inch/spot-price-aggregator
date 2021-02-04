// SPDX-License-Identifier: MIT

pragma solidity ^0.7.6;

import "./ICToken.sol";


interface IComptroller {
    function getAllMarkets() external view returns (ICToken[] memory);
    function markets(ICToken market) external view returns (bool isListed, uint256 collateralFactorMantissa, bool isComped);
}
