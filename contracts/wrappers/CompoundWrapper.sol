// SPDX-License-Identifier: MIT

pragma solidity 0.7.6;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "../interfaces/IComptroller.sol";
import "../interfaces/IWrapper.sol";


contract CompoundWrapper is IWrapper {
    using SafeMath for uint256;

    IComptroller private constant _COMPTROLLER = IComptroller(0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B);
    IERC20 private constant _ETH = IERC20(0x0000000000000000000000000000000000000000);
    IERC20 private constant _CETH = IERC20(0x4Ddc2D193948926D02f9B1fE9e1daa0718270ED5);

    mapping(IERC20 => IERC20) public cTokenToToken;
    mapping(IERC20 => IERC20) public tokenTocToken;

    function addMarkets(ICToken[] memory markets) external {
        for (uint256 i = 0; i < markets.length; i++) {
            (bool isListed, , ) = _COMPTROLLER.markets(markets[i]);
            require(isListed, "Market is not listed");
            IERC20 underlying = markets[i].underlying();
            cTokenToToken[markets[i]] = underlying;
            tokenTocToken[underlying] = markets[i];
        }
    }

    function removeMarkets(ICToken[] memory markets) external {
        for (uint256 i = 0; i < markets.length; i++) {
            (bool isListed, , ) = _COMPTROLLER.markets(markets[i]);
            require(!isListed, "Market is listed");
            IERC20 underlying = markets[i].underlying();
            delete cTokenToToken[markets[i]];
            delete tokenTocToken[underlying];
        }
    }

    function wrap(IERC20 token) external view override returns (IERC20 wrappedToken, uint256 rate) {
        if (token == _ETH) {
            return (_CETH, ICToken(address(_CETH)).exchangeRateStored());
        } else if (token == _CETH) {
            return (_ETH, uint256(1e36).div(ICToken(address(_CETH)).exchangeRateStored()));
        }
        IERC20 underlying = cTokenToToken[token];
        IERC20 cToken = tokenTocToken[token];
        if(underlying != IERC20(0)) {
            return (underlying, uint256(1e36).div(ICToken(address(token)).exchangeRateStored()));
        } else if (cToken != IERC20(0)) {
            return (cToken, ICToken(address(cToken)).exchangeRateStored());
        } else {
            revert("Unsupported token");
        }
    }
}
