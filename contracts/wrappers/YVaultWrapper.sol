// SPDX-License-Identifier: MIT

pragma solidity 0.8.9;
pragma abicoder v1;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../interfaces/IWrapper.sol";
import "../interfaces/IYVault.sol";

contract YVaultWrapper is IWrapper {
    // only unwrapping is supported for now
    function wrap(IERC20 token) external view override returns (IERC20 wrappedToken, uint256 rate) {
        IYVault vault = IYVault(address(token));
        wrappedToken = vault.token();
        try vault.token() returns(IERC20 _token) {
            wrappedToken = _token;
            try vault.getPricePerFullShare() returns(uint256 _rate) {
                // vault V1
                rate = _rate;
            } catch {
                try vault.pricePerShare() returns(uint256 _rate) {
                    // vault V2
                    uint8 decimals = ERC20(address(wrappedToken)).decimals();
                    rate = _rate * (10 ** 18) / (10 ** decimals);
                } catch {
                    revert("Unsupported token");
                }
            }
        } catch {
            revert("Unsupported token");
        }
    }
}
