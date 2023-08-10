// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "../interfaces/IOracle.sol";

abstract contract OracleBase is IOracle {
    using Math for uint256;

    IERC20 private constant _NONE = IERC20(0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF);

    function getRate(IERC20 srcToken, IERC20 dstToken, IERC20 connector, uint256 /*thresholdFilter*/) external view override returns (uint256 rate, uint256 weight) {
        uint256 balance0;
        uint256 balance1;
        if (connector == _NONE) {
            (balance0, balance1) = _getBalances(srcToken, dstToken);
            weight = (balance0 * balance1).sqrt();
        } else {
            uint256 balanceConnector0;
            uint256 balanceConnector1;
            (balance0, balanceConnector0) = _getBalances(srcToken, connector);
            (balanceConnector1, balance1) = _getBalances(connector, dstToken);
            if (balanceConnector0 > balanceConnector1) {
                balance0 = Math.mulDiv(balance0, balanceConnector1, balanceConnector0);
            } else {
                balance1 = Math.mulDiv(balance1, balanceConnector0, balanceConnector1);
            }
            weight = Math.min(balance0 * balanceConnector0, balance1 * balanceConnector1).sqrt();
        }

        rate = Math.mulDiv(balance1, 1e18, balance0);
    }

    function _getBalances(IERC20 srcToken, IERC20 dstToken) internal view virtual returns (uint256 srcBalance, uint256 dstBalance);
}
