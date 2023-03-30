// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import "../interfaces/ILoanToken.sol";
import "../interfaces/IBzxProtocol.sol";
import "../interfaces/IWrapper.sol";

contract FulcrumWrapper is IWrapper {
    IBzxProtocol private constant _BZX_PROTOCOL = IBzxProtocol(0xD8Ee69652E4e4838f2531732a46d1f7F584F0b7f);

    mapping(IERC20 => IERC20) public iTokenToToken;
    mapping(IERC20 => IERC20) public tokenToiToken;

    function addMarkets(IERC20[] memory markets) external {
        unchecked {
            for (uint256 i = 0; i < markets.length; i++) {
                address loanPool = _BZX_PROTOCOL.underlyingToLoanPool(address(markets[i]));
                if(loanPool == address(0)) revert NotAddedMarket();
                iTokenToToken[IERC20(loanPool)] = markets[i];
                tokenToiToken[markets[i]] = IERC20(loanPool);
            }
        }
    }

    function removeMarkets(IERC20[] memory markets) external {
        unchecked {
            for (uint256 i = 0; i < markets.length; i++) {
                address loanPool = _BZX_PROTOCOL.underlyingToLoanPool(address(markets[i]));
                if(loanPool != address(0)) revert NotRemovedMarket();
                delete iTokenToToken[IERC20(loanPool)];
                delete tokenToiToken[markets[i]];
            }
        }
    }

    function wrap(IERC20 token) external view override returns (IERC20 wrappedToken, uint256 rate) {
        IERC20 underlying = iTokenToToken[token];
        IERC20 iToken = tokenToiToken[token];
        if (underlying != IERC20(address(0))) {
            return (underlying, 1e36 / ILoanToken(address(token)).tokenPrice());
        } else if (iToken != IERC20(address(0))) {
            return (iToken, ILoanToken(address(iToken)).tokenPrice());
        } else {
            revert NotSupportedToken();
        }
    }
}
