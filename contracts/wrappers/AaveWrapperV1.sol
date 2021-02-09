// SPDX-License-Identifier: MIT

pragma solidity 0.7.6;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "../interfaces/ILendingPoolV1.sol";
import "../interfaces/IWrapper.sol";


contract AaveWrapperV1 is IWrapper {
    using SafeMath for uint256;

    IERC20 private constant _ETH = IERC20(0x0000000000000000000000000000000000000000);
    IERC20 private constant _EEE = IERC20(0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE);
    ILendingPoolV1 private constant _LENDING_POOL = ILendingPoolV1(0x398eC7346DcD622eDc5ae82352F02bE94C62d119);

    mapping(IERC20 => IERC20) public aTokenToToken;
    mapping(IERC20 => IERC20) public tokenToaToken;

    function addMarkets(IERC20[] memory tokens) external {
        for (uint256 i = 0; i < tokens.length; i++) {
            (,,,,,,,,,,, IERC20 aTokenAddress,) = _LENDING_POOL.getReserveData(address(tokens[i]));
            IERC20 aToken = IERC20(aTokenAddress);
            require(aToken != IERC20(0), "Token is not supported");
            aTokenToToken[aToken] = tokens[i];
            tokenToaToken[tokens[i]] = aToken;
        }
    }

    function removeMarkets(IERC20[] memory tokens) external {
        for (uint256 i = 0; i < tokens.length; i++) {
            (,,,,,,,,,,, IERC20 aTokenAddress,) = _LENDING_POOL.getReserveData(address(tokens[i]));
            IERC20 aToken = IERC20(aTokenAddress);
            require(aToken == IERC20(0), "Token is still supported");
            delete aTokenToToken[aToken];
            delete tokenToaToken[tokens[i]];
        }
    }

    function wrap(IERC20 token) external view override returns (IERC20 wrappedToken, uint256 rate) {
        token = token == _ETH ? _EEE : token;
        IERC20 underlying = aTokenToToken[token];
        IERC20 aToken = tokenToaToken[token];
        if (underlying != IERC20(0)) {
            return (underlying == _ETH ? _EEE : underlying, 1e18);
        } else if (aToken != IERC20(0)) {
            return (aToken, 1e18);
        } else {
            revert("Unsupported token");
        }
    }
}
