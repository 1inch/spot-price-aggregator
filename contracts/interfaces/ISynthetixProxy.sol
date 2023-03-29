// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

interface ISynthetixProxy {
    function target() external view returns (address);
}
