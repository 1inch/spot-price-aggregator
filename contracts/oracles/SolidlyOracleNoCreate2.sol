// SPDX-License-Identifier: MIT

pragma solidity 0.8.23;

import "./SolidlyOracle.sol";
import "../interfaces/ISolidlyFactory.sol";

contract SolidlyOracleNoCreate2 is SolidlyOracle {
    constructor(address _factory) SolidlyOracle(_factory, bytes32(0)) {}

    function _pairFor(IERC20 tokenA, IERC20 tokenB, bool stable) internal override view returns (address pair) {
        return ISolidlyFactory(FACTORY).getPair(tokenA, tokenB, stable);
    }
}
