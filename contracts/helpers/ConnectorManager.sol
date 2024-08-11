// SPDX-License-Identifier: MIT

pragma solidity 0.8.23;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title ConnectorManager
 * @notice Contract is used to support only specific connectors in the oracle.
 */
contract ConnectorManager is Ownable {
    event ConnectorUpdated(IERC20 connector, bool isSupported);

    IERC20 internal constant _NONE = IERC20(0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF);

    mapping(IERC20 => bool) public connectorSupported;

    constructor(IERC20[] memory connectors, address owner) Ownable(owner) {
        connectorSupported[_NONE] = true;
        for (uint256 i = 0; i < connectors.length; i++) {
            connectorSupported[connectors[i]] = true;
        }
    }

    function toggleConnectorSupport(IERC20 connector) external onlyOwner {
        connectorSupported[connector] = !connectorSupported[connector];
        emit ConnectorUpdated(connector, connectorSupported[connector]);
    }
}
