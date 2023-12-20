// SPDX-License-Identifier: MIT

// solhint-disable one-contract-per-file

pragma solidity 0.8.23;

interface IChai {
    function balanceOf(address) external view returns (uint256);
    function join(address, uint256) external;
    function exit(address, uint256) external;
}

interface IChaiPot {
    function chi() external view returns (uint256);
}

