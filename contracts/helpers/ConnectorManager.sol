// SPDX-License-Identifier: MIT

pragma solidity 0.8.23;

import "@openzeppelin/contracts/access/Ownable.sol";

contract ConnectorManager is Ownable {
    event ConnectorUpdated(address connector, bool isSupported);

    mapping(address => bool) public connectorSupported;

    constructor(address[] memory connectors, address owner) Ownable(owner) {
        for (uint256 i = 0; i < connectors.length; i++) {
            connectorSupported[connectors[i]] = true;
        }
    }

    function toggleConnectorSupport(address connector) external onlyOwner {
        connectorSupported[connector] = !connectorSupported[connector];
        emit ConnectorUpdated(connector, connectorSupported[connector]);
    }
}
