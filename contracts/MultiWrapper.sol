// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "./interfaces/IWrapper.sol";

/**
 * @title MultiWrapper
 * @notice Сontract allows for the management of multiple `IWrapper` contracts that can be used to wrap tokens in OffchainOracle's calculations.
 * Wrappers are contracts that enable the conversion of tokens from one protocol to another.
 * The contract provides functions to add and remove wrappers, as well as get information about the wrapped tokens and their conversion rates.
 */
contract MultiWrapper is Ownable {
    using EnumerableSet for EnumerableSet.AddressSet;

    error WrapperAlreadyAdded();
    error UnknownWrapper();

    event WrapperAdded(IWrapper connector);
    event WrapperRemoved(IWrapper connector);

    EnumerableSet.AddressSet private _wrappers;

    /**
     * @notice Adds the provided wrappers to the contract.
     * @dev Initializes the MultiWrapper with an array of existing `IWrapper` contracts.
     * @param existingWrappers Initial wrappers to be added.
     */
    constructor(IWrapper[] memory existingWrappers) {
        unchecked {
            for (uint256 i = 0; i < existingWrappers.length; i++) {
                if (!_wrappers.add(address(existingWrappers[i]))) revert WrapperAlreadyAdded();
                emit WrapperAdded(existingWrappers[i]);
            }
        }
    }

    /**
     * @notice Returns all wrappers currently added to the contract.
     * @return allWrappers Array of wrapper contracts.
     */
    function wrappers() external view returns (IWrapper[] memory allWrappers) {
        allWrappers = new IWrapper[](_wrappers.length());
        unchecked {
            for (uint256 i = 0; i < allWrappers.length; i++) {
                allWrappers[i] = IWrapper(address(uint160(uint256(_wrappers._inner._values[i]))));
            }
        }
    }

    /**
     * @notice Adds a distinct wrapper contract that cannot be duplicated. Only the owner can add a wrapper.
     * @param wrapper The address of the wrapper to be added.
     */
    function addWrapper(IWrapper wrapper) external onlyOwner {
        if (!_wrappers.add(address(wrapper))) revert WrapperAlreadyAdded();
        emit WrapperAdded(wrapper);
    }

    /**
     * @notice Removes a specified wrapper contract. Only the owner can remove a wrapper.
     * @param wrapper The address of the wrapper to be removed.
     */
    function removeWrapper(IWrapper wrapper) external onlyOwner {
        if (!_wrappers.remove(address(wrapper))) revert UnknownWrapper();
        emit WrapperRemoved(wrapper);
    }

    /**
     * @notice Retrieves the wrapped tokens and their conversion rates for a given token.
     * @dev Iterates over the wrappers to determine the wrapped tokens and their conversion rates.
     * @param token The token for which to retrieve the wrapped tokens and conversion rates.
     * @return wrappedTokens Tokens obtainable by wrapping the input token, including the input token and a rate of 1e18 for it.
     * @return rates Conversion rates for the wrapped tokens.
     */
    function getWrappedTokens(IERC20 token) external view returns (IERC20[] memory wrappedTokens, uint256[] memory rates) {
        unchecked {
            IERC20[] memory memWrappedTokens = new IERC20[](20);
            uint256[] memory memRates = new uint256[](20);
            uint256 len = 0;
            for (uint256 i = 0; i < _wrappers._inner._values.length; i++) {
                try IWrapper(address(uint160(uint256(_wrappers._inner._values[i])))).wrap(token) returns (IERC20 wrappedToken, uint256 rate) {
                    memWrappedTokens[len] = wrappedToken;
                    memRates[len] = rate;
                    len += 1;
                    for (uint256 j = 0; j < _wrappers._inner._values.length; j++) {
                        if (i != j) {
                            try IWrapper(address(uint160(uint256(_wrappers._inner._values[j])))).wrap(wrappedToken) returns (IERC20 wrappedToken2, uint256 rate2) {
                                bool used = false;
                                for (uint256 k = 0; k < len; k++) {
                                    if (wrappedToken2 == memWrappedTokens[k]) {
                                        used = true;
                                        break;
                                    }
                                }
                                if (!used) {
                                    memWrappedTokens[len] = wrappedToken2;
                                    memRates[len] = Math.mulDiv(rate, rate2, 1e18);
                                    len += 1;
                                }
                            } catch {
                                continue;
                            }
                        }
                    }
                } catch {
                    continue;
                }
            }
            wrappedTokens = new IERC20[](len + 1);
            rates = new uint256[](len + 1);
            for (uint256 i = 0; i < len; i++) {
                wrappedTokens[i] = memWrappedTokens[i];
                rates[i] = memRates[i];
            }
            wrappedTokens[len] = token;
            rates[len] = 1e18;
        }
    }
}
