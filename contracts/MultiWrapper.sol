// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "./interfaces/IWrapper.sol";

/**
 * @title MultiWrapper
 * @notice The MultiWrapper contract allows for the management of multiple wrappers that can be used to wrap tokens.
 * Wrappers are contracts that enable the conversion of tokens from one protocol to another.
 * The contract provides functions to add and remove wrappers, as well as get information about the wrapped tokens and their conversion rates.
 */
contract MultiWrapper is Ownable {
    using SafeMath for uint256;
    using EnumerableSet for EnumerableSet.AddressSet;

    error WrapperAlreadyAdded();
    error UnknownWrapper();

    event WrapperAdded(IWrapper connector);
    event WrapperRemoved(IWrapper connector);

    EnumerableSet.AddressSet private _wrappers;

    /**
     * @dev Initializes the MultiWrapper contract.
     * @param existingWrappers An array of existing wrapper contracts to be added during initialization.
     * @notice The constructor adds the existing wrappers to the contract and emits events for each added wrapper.
     * If a wrapper is already added, it will throw a WrapperAlreadyAdded error and revert the transaction.
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
     * @dev Returns an array of all the wrappers currently added to the contract.
     * @return allWrappers An array of IWrapper contracts representing all the wrappers.
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
     * @dev Adds a new wrapper contract to the MultiWrapper.
     * @param wrapper The address of the wrapper contract to be added.
     * @notice Only the contract owner can add a new wrapper.
     * If the wrapper is already added, it will throw a WrapperAlreadyAdded error and revert the transaction.
     */
    function addWrapper(IWrapper wrapper) external onlyOwner {
        if (!_wrappers.add(address(wrapper))) revert WrapperAlreadyAdded();
        emit WrapperAdded(wrapper);
    }

    /**
     * @dev Removes a wrapper contract from the MultiWrapper.
     * @param wrapper The address of the wrapper contract to be removed.
     * @notice Only the contract owner can remove a wrapper.
     * If the wrapper is not found, it will throw an UnknownWrapper error and revert the transaction.
     */
    function removeWrapper(IWrapper wrapper) external onlyOwner {
        if (!_wrappers.remove(address(wrapper))) revert UnknownWrapper();
        emit WrapperRemoved(wrapper);
    }

    /**
     * @dev Retrieves the wrapped tokens and their conversion rates for a given token.
     * @param token The ERC20 token for which to retrieve the wrapped tokens and conversion rates.
     * @return wrappedTokens An array of wrapped tokens that can be obtained by wrapping the input token.
     * @return rates An array of conversion rates corresponding to the wrapped tokens.
     * @notice This function iterates over the wrappers to determine the wrapped tokens and their conversion rates.
     * It returns an array of wrapped tokens and an array of rates, including the input token and a rate of 1e18 for it.
     * If a wrapper fails during the iteration, it will be skipped and the process will continue.
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
                                    memRates[len] = rate.mul(rate2).div(1e18);
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
