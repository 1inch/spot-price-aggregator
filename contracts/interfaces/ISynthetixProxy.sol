// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;
pragma abicoder v1;

interface ISynthetixProxy {
    function target() external view returns (address);
}
