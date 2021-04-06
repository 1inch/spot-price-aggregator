// SPDX-License-Identifier: MIT

pragma solidity 0.7.6;

import "../interfaces/IUniswapFactory.sol";
import "./OracleBase.sol";


contract UniswapOracle is OracleBase {
    IUniswapFactory private immutable _UNISWAP_FACTORY;  // solhint-disable-line var-name-mixedcase
    IERC20 private constant _ETH = IERC20(0x0000000000000000000000000000000000000000);

    constructor(IUniswapFactory factory) {
        _UNISWAP_FACTORY = factory;
    }

    function _getBalances(IERC20 srcToken, IERC20 dstToken) internal view override returns (uint256 srcBalance, uint256 dstBalance) {
        if (srcToken == _ETH) {
            address exchange = _UNISWAP_FACTORY.getExchange(dstToken);
            require(exchange != address(0), "Pool does not exist");
            srcBalance = exchange.balance;
            dstBalance = dstToken.balanceOf(exchange);
        } else if (dstToken == _ETH) {
            address exchange = _UNISWAP_FACTORY.getExchange(srcToken);
            require(exchange != address(0), "Pool does not exist");
            srcBalance = srcToken.balanceOf(exchange);
            dstBalance = exchange.balance;
        } else {
            revert("Unsupported tokens");
        }
    }
}
