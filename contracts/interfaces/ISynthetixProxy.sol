// SPDX-License-Identifier: MIT

pragma solidity 0.8.15;
pragma abicoder v1;

interface ISynthetixProxy {
    function target() external view returns (address);
}
