// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;
pragma abicoder v1;

import "../interfaces/IMooniswapFactory.sol";
import "./OracleBase.sol";


contract MooniswapOracle is OracleBase {
    IMooniswapFactory public immutable factory;
    IERC20 private constant _ETH = IERC20(0x0000000000000000000000000000000000000000);

    constructor(IMooniswapFactory _factory) {
        factory = _factory;
    }

    function _getBalances(IERC20 srcToken, IERC20 dstToken) internal view override returns (uint256, uint256) {
        IMooniswap mooniswap = factory.pools(srcToken, dstToken);
        IERC20[] memory tokens = mooniswap.getTokens();
        uint256[2] memory balances;
        for (uint256 i = 0; i < 2; ++i) {
            if (tokens[i] == _ETH) {
                balances[i] = address(mooniswap).balance;
            } else {
                balances[i] = tokens[i].balanceOf(address(mooniswap));
            }
        }
        if (tokens[0] == srcToken) {
            return (balances[0], balances[1]);
        } else {
            return (balances[1], balances[0]);
        }
    }
}
