// SPDX-License-Identifier: MIT

pragma solidity 0.8.23;

import "./SolidlyOracle.sol";
import "../interfaces/ISolidlyFactory.sol";

contract SolidlyOracleZksync is SolidlyOracle {
    /// @dev keccak256("zksyncCreate2")
    bytes32 public constant CREATE2_PREFIX = 0x2020dba91b30cc0006188af794c2fb30dd8520db7e2c088b7fc7c103c00ca494;

    constructor(address _factory, bytes32 _initcodeHash) SolidlyOracle(_factory, _initcodeHash) {}

    function _pairFor(IERC20 tokenA, IERC20 tokenB, bool stable) internal override view returns (address pair) {
        pair = address(uint160(uint256(keccak256(abi.encodePacked(
                CREATE2_PREFIX,
                FACTORY,
                keccak256(abi.encodePacked(tokenA, tokenB, stable)),
                INITCODE_HASH,
                keccak256(abi.encodePacked(""))
            )))));
    }
}
