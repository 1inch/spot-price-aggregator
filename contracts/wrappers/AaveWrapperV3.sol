// SPDX-License-Identifier: MIT

pragma solidity 0.8.23;

import "../interfaces/ILendingPoolV3.sol";
import "../interfaces/IWrapper.sol";

contract AaveWrapperV3 is IWrapper {
    // solhint-disable-next-line var-name-mixedcase
    ILendingPoolV3 private immutable _LENDING_POOL;

    mapping(IERC20 => IERC20) public aTokenToToken;
    mapping(IERC20 => IERC20) public tokenToaToken;

    constructor(ILendingPoolV3 lendingPool) {
        _LENDING_POOL = lendingPool;
    }

    function addMarkets(IERC20[] memory tokens) external {
        unchecked {
            for (uint256 i = 0; i < tokens.length; i++) {
                (address aTokenAddress,,) = _LENDING_POOL.getReserveTokensAddresses(address(tokens[i]));
                IERC20 aToken = IERC20(aTokenAddress);
                if(aToken == IERC20(address(0))) revert NotAddedMarket();
                aTokenToToken[aToken] = tokens[i];
                tokenToaToken[tokens[i]] = aToken;
            }
        }
    }

    function removeMarkets(IERC20[] memory tokens) external {
        unchecked {
            for (uint256 i = 0; i < tokens.length; i++) {
                (address aTokenAddress,,) = _LENDING_POOL.getReserveTokensAddresses(address(tokens[i]));
                IERC20 aToken = IERC20(aTokenAddress);
                if(aToken == IERC20(address(0))) revert NotRemovedMarket();
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
            revert NotSupportedToken();
        }
    }
}
