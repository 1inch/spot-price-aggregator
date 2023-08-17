// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import "./OracleBase.sol";
import "../interfaces/IUniswapV2Pair.sol";

contract UniswapV2LikeOracle is OracleBase {
    address public immutable FACTORY;
    bytes32 public immutable INITCODE_HASH;

    constructor(address _factory, bytes32 _initcodeHash) {
        FACTORY = _factory;
        INITCODE_HASH = _initcodeHash;
    }

    // calculates the CREATE2 address for a pair without making any external calls
    function _pairFor(IERC20 tokenA, IERC20 tokenB) private view returns (address pair) {
        pair = address(uint160(uint256(keccak256(abi.encodePacked(
                hex"ff",
                FACTORY,
                keccak256(abi.encodePacked(tokenA, tokenB)),
                INITCODE_HASH
            )))));
    }

    function _getBalances(IERC20 srcToken, IERC20 dstToken) internal view override returns (uint256 srcBalance, uint256 dstBalance) {
        (IERC20 token0, IERC20 token1) = srcToken < dstToken ? (srcToken, dstToken) : (dstToken, srcToken);
        (uint256 reserve0, uint256 reserve1,) = IUniswapV2Pair(_pairFor(token0, token1)).getReserves();
        (srcBalance, dstBalance) = srcToken == token0 ? (reserve0, reserve1) : (reserve1, reserve0);
    }
}
