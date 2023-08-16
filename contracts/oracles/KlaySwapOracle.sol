// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import "./OracleBase.sol";
import "../interfaces/IUniswapV2Pair.sol";

interface IKlaySwapFactory {
    function tokenToPool(IERC20 tokenA, IERC20 tokenB) external view returns(address pool);
}

interface IKlaySwapStorage {
    function getReserves(address pool) external view returns(uint256 reserve0, uint256 reserve1, uint256 timestamp);
}

contract KlaySwapOracle is OracleBase {
    IKlaySwapFactory public immutable FACTORY;
    IKlaySwapStorage public immutable RESERVE_STORAGE;

    constructor(IKlaySwapFactory _factory, IKlaySwapStorage _storage) {
        FACTORY = _factory;
        RESERVE_STORAGE = _storage;
    }

    function _getBalances(IERC20 srcToken, IERC20 dstToken) internal view override returns (uint256 srcBalance, uint256 dstBalance) {
        (IERC20 token0, IERC20 token1) = srcToken < dstToken ? (srcToken, dstToken) : (dstToken, srcToken);
        (uint256 reserve0, uint256 reserve1,) = RESERVE_STORAGE.getReserves(FACTORY.tokenToPool(token0, token1));
        (srcBalance, dstBalance) = srcToken == token0 ? (reserve0, reserve1) : (reserve1, reserve0);
    }
}
