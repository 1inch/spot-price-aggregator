// SPDX-License-Identifier: MIT

pragma solidity 0.7.6;

contract UniswapV3DeploymentPredictor {
    address public immutable factory;
    bytes32 public immutable initcodeHash;

    constructor(address _factory, bytes32 _initcodeHash) {
        factory = _factory;
        initcodeHash = _initcodeHash;
    }

    function getPool(
        address token0,
        address token1,
        uint24 fee
    ) public view returns (address) {
        return address(uint256(keccak256(abi.encodePacked(
                hex"ff",
                factory,
                keccak256(abi.encode(token0, token1, fee)),
                initcodeHash
            ))));
    }
}
