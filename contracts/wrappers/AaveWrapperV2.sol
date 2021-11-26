// SPDX-License-Identifier: MIT

pragma solidity 0.8.10;

import "../interfaces/ILendingPoolV2.sol";
import "../interfaces/IWrapper.sol";


contract AaveWrapperV2 is IWrapper {
    // solhint-disable-next-line var-name-mixedcase
    ILendingPoolV2 private immutable _LENDING_POOL;

    mapping(IERC20 => IERC20) public aTokenToToken;
    mapping(IERC20 => IERC20) public tokenToaToken;

    constructor(ILendingPoolV2 lendingPool) {
        _LENDING_POOL = lendingPool;
    }

    function addMarkets(IERC20[] memory tokens) external {
        unchecked {
            for (uint256 i = 0; i < tokens.length; i++) {
                ILendingPoolV2.ReserveData memory reserveData = _LENDING_POOL.getReserveData(address(tokens[i]));
                IERC20 aToken = IERC20(reserveData.aTokenAddress);
                require(aToken != IERC20(address(0)), "Token is not supported");
                aTokenToToken[aToken] = tokens[i];
                tokenToaToken[tokens[i]] = aToken;
            }
        }
    }

    function removeMarkets(IERC20[] memory tokens) external {
        unchecked {
            for (uint256 i = 0; i < tokens.length; i++) {
                ILendingPoolV2.ReserveData memory reserveData = _LENDING_POOL.getReserveData(address(tokens[i]));
                IERC20 aToken = IERC20(reserveData.aTokenAddress);
                require(aToken == IERC20(address(0)), "Token is still supported");
                delete aTokenToToken[aToken];
                delete tokenToaToken[tokens[i]];
            }
        }
    }

    function wrap(IERC20 token) external view override returns (IERC20 wrappedToken, uint256 rate) {
        IERC20 underlying = aTokenToToken[token];
        IERC20 aToken = tokenToaToken[token];
        if (underlying != IERC20(address(0))) {
            return (underlying, 1e18);
        } else if (aToken != IERC20(address(0))) {
            return (aToken, 1e18);
        } else {
            revert("Unsupported token");
        }
    }
}
