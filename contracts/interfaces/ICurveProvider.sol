// SPDX-License-Identifier: MIT

pragma solidity 0.8.11;
pragma abicoder v1;

interface ICurveProvider {
    function get_address (uint256 _id) external view returns (address);
}
