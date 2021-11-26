// SPDX-License-Identifier: MIT

pragma solidity 0.8.10;
pragma abicoder v1;

import "../interfaces/IComptroller.sol";
import "../interfaces/IWrapper.sol";


contract CompoundLikeWrapper is IWrapper {
    IComptroller private immutable _comptroller;
    IERC20 private constant _BASE = IERC20(0x0000000000000000000000000000000000000000);
    IERC20 private immutable _cBase;

    mapping(IERC20 => IERC20) public cTokenToToken;
    mapping(IERC20 => IERC20) public tokenTocToken;

    constructor(IComptroller comptroller, IERC20 cBase) {
        _comptroller = comptroller;
        _cBase = cBase;
    }

    function addMarkets(ICToken[] memory markets) external {
        unchecked {
            for (uint256 i = 0; i < markets.length; i++) {
                (bool isListed, , ) = _comptroller.markets(markets[i]);
                require(isListed, "Market is not listed");
                IERC20 underlying = markets[i].underlying();
                cTokenToToken[markets[i]] = underlying;
                tokenTocToken[underlying] = markets[i];
            }
        }
    }

    function removeMarkets(ICToken[] memory markets) external {
        unchecked {
            for (uint256 i = 0; i < markets.length; i++) {
                (bool isListed, , ) = _comptroller.markets(markets[i]);
                require(!isListed, "Market is listed");
                IERC20 underlying = markets[i].underlying();
                delete cTokenToToken[markets[i]];
                delete tokenTocToken[underlying];
            }
        }
    }

    function wrap(IERC20 token) external view override returns (IERC20 wrappedToken, uint256 rate) {
        if (token == _BASE) {
            return (_cBase, 1e36 / ICToken(address(_cBase)).exchangeRateStored());
        } else if (token == _cBase) {
            return (_BASE, ICToken(address(_cBase)).exchangeRateStored());
        }
        IERC20 underlying = cTokenToToken[token];
        IERC20 cToken = tokenTocToken[token];
        if (underlying != IERC20(address(0))) {
            return (underlying, ICToken(address(token)).exchangeRateStored());
        } else if (cToken != IERC20(address(0))) {
            return (cToken, 1e36 / ICToken(address(cToken)).exchangeRateStored());
        } else {
            revert("Unsupported token");
        }
    }
}
