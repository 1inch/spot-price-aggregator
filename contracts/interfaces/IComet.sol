// SPDX-License-Identifier: MIT

pragma solidity 0.8.23;

// CompoundV3 money market interface
interface IComet {
    function baseToken() external view returns (address);
    function supply(address asset, uint amount) external;
    function withdraw(address asset, uint amount) external;
}
