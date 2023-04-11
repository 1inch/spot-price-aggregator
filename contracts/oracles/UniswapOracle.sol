// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import "../interfaces/IUniswapFactory.sol";
import "./OracleBase.sol";

contract UniswapOracle is OracleBase {
    error UnsupportedTokens();

    IUniswapFactory public immutable factory;
    IERC20 private constant _ETH = IERC20(0x0000000000000000000000000000000000000000);

    constructor(IUniswapFactory _factory) {
        factory = _factory;
    }

    function _getBalances(IERC20 srcToken, IERC20 dstToken) internal view override returns (uint256 srcBalance, uint256 dstBalance) {
        if (srcToken == _ETH) {
            address exchange = factory.getExchange(dstToken);
            if(exchange == address(0)) revert PoolNotFound();
            srcBalance = exchange.balance;
            dstBalance = dstToken.balanceOf(exchange);
        } else if (dstToken == _ETH) {
            address exchange = factory.getExchange(srcToken);
            if(exchange == address(0)) revert PoolNotFound();
            srcBalance = srcToken.balanceOf(exchange);
            dstBalance = exchange.balance;
        } else {
            revert UnsupportedTokens();
        }
    }
}
