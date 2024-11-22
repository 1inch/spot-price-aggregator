// SPDX-License-Identifier: MIT

pragma solidity 0.8.23;

import "../interfaces/IWrapper.sol";
import "@openzeppelin/contracts/interfaces/IERC4626.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Erc4626Wrapper is IWrapper, Ownable {
    mapping(IERC20 => IERC20) public baseToWbase;
    mapping(IERC20 => IERC20) public wbaseToBase;

    constructor(address _owner) Ownable(_owner) {} // solhint-disable-line no-empty-blocks

    function addMarkets(address[] memory tokens) external onlyOwner {
        for (uint256 i = 0; i < tokens.length; i++) {
            IERC20 baseToken = IERC20(IERC4626(tokens[i]).asset());
            wbaseToBase[IERC20(tokens[i])] = baseToken;
            baseToWbase[baseToken] = IERC20(tokens[i]);
        }
    }

    function removeMarkets(address[] memory tokens) external onlyOwner {
        for (uint256 i = 0; i < tokens.length; i++) {
            IERC20 baseToken = IERC20(IERC4626(tokens[i]).asset());
            delete wbaseToBase[IERC20(tokens[i])];
            delete baseToWbase[baseToken];
        }
    }

    function wrap(IERC20 token) external view override returns (IERC20 wrappedToken, uint256 rate) {
        IERC20 base = wbaseToBase[token];
        IERC20 wbase = baseToWbase[token];
        if (base != IERC20(address(0))) {
            return (base, IERC4626(address(token)).convertToAssets(1e18)); // scale up when redeeming wbase for base
        } else if (wbase != IERC20(address(0))) {
            return (wbase, IERC4626(address(wbase)).convertToShares(1e18)); // scale down when minting wbase with base
        } else {
            revert NotSupportedToken();
        }
    }
}
