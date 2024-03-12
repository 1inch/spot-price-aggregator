// SPDX-License-Identifier: MIT

pragma solidity 0.8.23;

import "../interfaces/IWrapper.sol";
import "../interfaces/IComet.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CompoundV3Wrapper is IWrapper, Ownable {
    mapping(IERC20 => IERC20) public cTokenToToken;
    mapping(IERC20 => IERC20) public tokenTocToken;

    constructor(address _owner) Ownable(_owner) {} // solhint-disable-line no-empty-blocks

    function addToken(address token) external onlyOwner {
        IERC20 baseToken = IERC20(IComet(token).baseToken());
        cTokenToToken[IERC20(token)] = baseToken;
        tokenTocToken[baseToken] = IERC20(token);
    }

    function removeToken(address token) external onlyOwner {
        IERC20 baseToken = IERC20(IComet(token).baseToken());
        delete cTokenToToken[IERC20(token)];
        delete tokenTocToken[baseToken];
    }

    function wrap(IERC20 token) external view override returns (IERC20 wrappedToken, uint256 rate) {
        IERC20 baseToken = cTokenToToken[token];
        IERC20 cToken = tokenTocToken[token];
        if (baseToken != IERC20(address(0))) {
            return (baseToken, 1e18);
        } else if (cToken != IERC20(address(0))) {
            return (cToken, 1e18);
        } else {
            revert NotSupportedToken();
        }
    }
}
