// SPDX-License-Identifier: MIT

pragma solidity 0.8.23;

import "../interfaces/IAlgebraPool.sol";
import "./UniswapV3LikeOracle.sol";

contract AlgebraOracle is UniswapV3LikeOracle {
    constructor(address _factory, bytes32 _initcodeHash)
        UniswapV3LikeOracle(_factory, _initcodeHash, new uint24[](1)) {} // solhint-disable-line no-empty-blocks

    function _getPool(address token0, address token1, uint24 /* fee */) internal view override returns (address) {
        return address(uint160(uint256(
                keccak256(
                    abi.encodePacked(
                        hex'ff',
                        FACTORY,
                        keccak256(abi.encode(token0, token1)),
                        INITCODE_HASH
                    )
                )
            )));
    }

    function _currentState(address pool) internal view override returns (uint256 sqrtPriceX96, int24 tick) {
        (sqrtPriceX96, tick) = IAlgebraPool(pool).globalState();
    }
}
