// SPDX-License-Identifier: MIT

pragma solidity 0.7.6;
pragma abicoder v2;  // solhint-disable-line compiler-version

import "@openzeppelin/contracts/math/SafeMath.sol";
import "../interfaces/ILendingPool.sol";
import "../interfaces/IWrapper.sol";


contract AaveWrapper is IWrapper {
    using SafeMath for uint256;

    ILendingPool private constant _LENDING_POOL = ILendingPool(0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9);

    mapping(IERC20 => IERC20) public aTokenToToken;
    mapping(IERC20 => IERC20) public tokenToaToken;

    function addMarkets(IERC20[] memory tokens) external {
        for (uint256 i = 0; i < tokens.length; i++) {
            ILendingPool.ReserveData memory reserveData = _LENDING_POOL.getReserveData(address(tokens[i]));
            IERC20 aToken = IERC20(reserveData.aTokenAddress);
            require(aToken != IERC20(0), "Token is not supported");
            aTokenToToken[aToken] = tokens[i];
            tokenToaToken[tokens[i]] = aToken;
        }
    }

    function removeMarkets(IERC20[] memory tokens) external {
        for (uint256 i = 0; i < tokens.length; i++) {
            ILendingPool.ReserveData memory reserveData = _LENDING_POOL.getReserveData(address(tokens[i]));
            IERC20 aToken = IERC20(reserveData.aTokenAddress);
            require(aToken == IERC20(0), "Token is still supported");
            delete aTokenToToken[aToken];
            delete tokenToaToken[tokens[i]];
        }
    }

    function wrap(IERC20 token) external view override returns (IERC20 wrappedToken, uint256 rate) {
        IERC20 underlying = aTokenToToken[token];
        IERC20 aToken = tokenToaToken[token];
        if (underlying != IERC20(0)) {
            return (underlying, 1e18);
        } else if (aToken != IERC20(0)) {
            return (aToken, 1e18);
        } else {
            revert("Unsupported token");
        }
    }
}
