// SPDX-License-Identifier: MIT

pragma solidity ^0.7.6;

// https://docs.synthetix.io/contracts/source/interfaces/iaddressresolver
interface ISynthAddressResolver {
    function getAddress(bytes32 name) external view returns (address);

    function getSynth(bytes32 key) external view returns (address);

    function requireAndGetAddress(bytes32 name, string calldata reason) external view returns (address);
}