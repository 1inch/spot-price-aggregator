
## ConnectorManager

Contract is used to support only specific connectors in the oracle.

### Functions list
- [constructor(connectors, owner) public](#constructor)
- [toggleConnectorSupport(connector) external](#toggleconnectorsupport)

### Events list
- [ConnectorUpdated(connector, isSupported) ](#connectorupdated)

### Functions
### constructor

```solidity
constructor(address[] connectors, address owner) public
```

### toggleConnectorSupport

```solidity
function toggleConnectorSupport(address connector) external
```

### Events
### ConnectorUpdated

```solidity
event ConnectorUpdated(address connector, bool isSupported)
```

