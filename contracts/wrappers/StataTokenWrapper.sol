// SPDX-License-Identifier: MIT

pragma solidity 0.8.23;

import "../interfaces/IStaticATokenLM.sol";
import "../interfaces/IWrapper.sol";

contract StataTokenWrapper is IWrapper {
    IStaticATokenFactory public immutable FACTORY;

    mapping(IERC20 => IERC20) public stataTokenToToken;
    mapping(IERC20 => IERC20) public tokenToStataToken;

    constructor(IStaticATokenFactory staticATokenFactory) {
        FACTORY = staticATokenFactory;
    }

    function addMarkets(IERC20[] memory tokens) external {
        unchecked {
            for (uint256 i = 0; i < tokens.length; i++) {
                IERC20 stataToken = IERC20(FACTORY.getStaticAToken(address(tokens[i])));
                if(stataToken == IERC20(address(0))) revert NotAddedMarket();
                stataTokenToToken[stataToken] = tokens[i];
                tokenToStataToken[tokens[i]] = stataToken;
            }
        }
    }

    function removeMarkets(IERC20[] memory tokens) external {
        unchecked {
            for (uint256 i = 0; i < tokens.length; i++) {
                IERC20 stataToken = IERC20(FACTORY.getStaticAToken(address(tokens[i])));
                if(stataToken != IERC20(address(0))) revert NotRemovedMarket();
                delete stataTokenToToken[stataToken];
                delete tokenToStataToken[tokens[i]];
            }
        }
    }

    function wrap(IERC20 token) external view override returns (IERC20 wrappedToken, uint256 rate) {
        IERC20 underlying = stataTokenToToken[token];
        IERC20 stataToken = tokenToStataToken[token];
        if (underlying != IERC20(address(0))) {
            return (underlying, IStaticATokenLM(address(token)).rate() / 1e9);
        } else if (stataToken != IERC20(address(0))) {
            return (stataToken, 1e45 / IStaticATokenLM(address(stataToken)).rate());
        } else {
            revert NotSupportedToken();
        }
    }
}
