// SPDX-License-Identifier: MIT

pragma solidity 0.8.11;
pragma abicoder v1;

import "./IReserveToken.sol";

interface IConverter {
    function getConnectorBalance(IReserveToken connectorToken) external view returns (uint256);
}

