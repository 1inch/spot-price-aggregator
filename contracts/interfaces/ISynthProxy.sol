// SPDX-License-Identifier: MIT

pragma solidity ^0.7.6;

interface ISynthetixProxy {
    function target() external view returns (address);
}