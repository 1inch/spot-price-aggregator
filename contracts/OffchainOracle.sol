// SPDX-License-Identifier: MIT

pragma solidity 0.8.9;
pragma abicoder v1;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "./interfaces/IOracle.sol";
import "./interfaces/IWrapper.sol";
import "./MultiWrapper.sol";

contract OffchainOracle is Ownable {
    using SafeMath for uint256;
    using EnumerableSet for EnumerableSet.AddressSet;

    enum OracleType { WETH, ETH, WETH_ETH }

    event OracleAdded(IOracle oracle, OracleType oracleType);
    event OracleRemoved(IOracle oracle, OracleType oracleType);
    event ConnectorAdded(IERC20 connector);
    event ConnectorRemoved(IERC20 connector);
    event MultiWrapperUpdated(MultiWrapper multiWrapper);

    EnumerableSet.AddressSet private _wethOracles;
    EnumerableSet.AddressSet private _ethOracles;
    EnumerableSet.AddressSet private _connectors;
    MultiWrapper public multiWrapper;

    IERC20 private constant _BASE = IERC20(0x0000000000000000000000000000000000000000);
    IERC20 private immutable _wBase;

    constructor(MultiWrapper _multiWrapper, IOracle[] memory existingOracles, OracleType[] memory oracleTypes, IERC20[] memory existingConnectors, IERC20 wBase) {
        unchecked {
            require(existingOracles.length == oracleTypes.length, "Arrays length mismatch");
            multiWrapper = _multiWrapper;
            emit MultiWrapperUpdated(_multiWrapper);
            for (uint256 i = 0; i < existingOracles.length; i++) {
                if (oracleTypes[i] == OracleType.WETH) {
                    require(_wethOracles.add(address(existingOracles[i])), "Oracle already added");
                } else if (oracleTypes[i] == OracleType.ETH) {
                    require(_ethOracles.add(address(existingOracles[i])), "Oracle already added");
                } else if (oracleTypes[i] == OracleType.WETH_ETH) {
                    require(_wethOracles.add(address(existingOracles[i])), "Oracle already added");
                    require(_ethOracles.add(address(existingOracles[i])), "Oracle already added");
                } else {
                    revert("Invalid OracleTokenKind");
                }
                emit OracleAdded(existingOracles[i], oracleTypes[i]);
            }
            for (uint256 i = 0; i < existingConnectors.length; i++) {
                require(_connectors.add(address(existingConnectors[i])), "Connector already added");
                emit ConnectorAdded(existingConnectors[i]);
            }
            _wBase = wBase;
        }
    }

    function oracles() public view returns (IOracle[] memory allOracles, OracleType[] memory oracleTypes) {
        unchecked {
            IOracle[] memory oraclesBuffer = new IOracle[](_wethOracles._inner._values.length + _ethOracles._inner._values.length);
            OracleType[] memory oracleTypesBuffer = new OracleType[](oraclesBuffer.length);
            for (uint256 i = 0; i < _wethOracles._inner._values.length; i++) {
                oraclesBuffer[i] = IOracle(address(uint160(uint256(_wethOracles._inner._values[i]))));
                oracleTypesBuffer[i] = OracleType.WETH;
            }

            uint256 actualItemsCount = _wethOracles._inner._values.length;

            for (uint256 i = 0; i < _ethOracles._inner._values.length; i++) {
                OracleType kind = OracleType.ETH;
                uint256 oracleIndex = actualItemsCount;
                IOracle oracle = IOracle(address(uint160(uint256(_ethOracles._inner._values[i]))));
                for (uint j = 0; j < oraclesBuffer.length; j++) {
                    if (oraclesBuffer[j] == oracle) {
                        oracleIndex = j;
                        kind = OracleType.WETH_ETH;
                        break;
                    }
                }
                if (kind == OracleType.ETH) {
                    actualItemsCount++;
                }
                oraclesBuffer[oracleIndex] = oracle;
                oracleTypesBuffer[oracleIndex] = kind;
            }

            allOracles = new IOracle[](actualItemsCount);
            oracleTypes = new OracleType[](actualItemsCount);
            for (uint256 i = 0; i < actualItemsCount; i++) {
                allOracles[i] = oraclesBuffer[i];
                oracleTypes[i] = oracleTypesBuffer[i];
            }
        }
    }

    function connectors() external view returns (IERC20[] memory allConnectors) {
        unchecked {
            allConnectors = new IERC20[](_connectors.length());
            for (uint256 i = 0; i < allConnectors.length; i++) {
                allConnectors[i] = IERC20(address(uint160(uint256(_connectors._inner._values[i]))));
            }
        }
    }

    function setMultiWrapper(MultiWrapper _multiWrapper) external onlyOwner {
        multiWrapper = _multiWrapper;
        emit MultiWrapperUpdated(_multiWrapper);
    }

    function addOracle(IOracle oracle, OracleType oracleKind) external onlyOwner {
        if (oracleKind == OracleType.WETH) {
            require(_wethOracles.add(address(oracle)), "Oracle already added");
        } else if (oracleKind == OracleType.ETH) {
            require(_ethOracles.add(address(oracle)), "Oracle already added");
        } else if (oracleKind == OracleType.WETH_ETH) {
            require(_wethOracles.add(address(oracle)), "Oracle already added");
            require(_ethOracles.add(address(oracle)), "Oracle already added");
        } else {
            revert("Invalid OracleTokenKind");
        }
        emit OracleAdded(oracle, oracleKind);
    }

    function removeOracle(IOracle oracle, OracleType oracleKind) external onlyOwner {
        if (oracleKind == OracleType.WETH) {
            require(_wethOracles.remove(address(oracle)), "Unknown oracle");
        } else if (oracleKind == OracleType.ETH) {
            require(_ethOracles.remove(address(oracle)), "Unknown oracle");
        } else if (oracleKind == OracleType.WETH_ETH) {
            require(_wethOracles.remove(address(oracle)), "Unknown oracle");
            require(_ethOracles.remove(address(oracle)), "Unknown oracle");
        } else {
            revert("Invalid OracleTokenKind");
        }
        emit OracleRemoved(oracle, oracleKind);
    }

    function addConnector(IERC20 connector) external onlyOwner {
        require(_connectors.add(address(connector)), "Connector already added");
        emit ConnectorAdded(connector);
    }

    function removeConnector(IERC20 connector) external onlyOwner {
        require(_connectors.remove(address(connector)), "Unknown connector");
        emit ConnectorRemoved(connector);
    }

    /*
        WARNING!
        Usage of the dex oracle on chain is highly discouraged!
        getRate function can be easily manipulated inside transaction!
    */
    function getRate(IERC20 srcToken, IERC20 dstToken, bool useWrappers) external view returns (uint256 weightedRate) {
        require(srcToken != dstToken, "Tokens should not be the same");
        uint256 totalWeight;
        (IOracle[] memory allOracles, ) = oracles();
        (IERC20[] memory wrappedSrcTokens, uint256[] memory srcRates) = _getWrappedTokens(srcToken, useWrappers);
        (IERC20[] memory wrappedDstTokens, uint256[] memory dstRates) = _getWrappedTokens(dstToken, useWrappers);
        bytes32[] memory connectors_ = _connectors._inner._values;

        unchecked {
            for (uint256 k1 = 0; k1 < wrappedSrcTokens.length; k1++) {
                for (uint256 k2 = 0; k2 < wrappedDstTokens.length; k2++) {
                    if (wrappedSrcTokens[k1] == wrappedDstTokens[k2]) {
                        return srcRates[k1].mul(dstRates[k2]).div(1e18);
                    }
                    for (uint256 j = 0; j < connectors_.length; j++) {
                        if (IERC20(address(uint160(uint256(connectors_[j])))) == wrappedSrcTokens[k1] || IERC20(address(uint160(uint256(connectors_[j])))) == wrappedDstTokens[k2]) {
                            continue;
                        }
                        for (uint256 i = 0; i < allOracles.length; i++) {
                            try allOracles[i].getRate(wrappedSrcTokens[k1], wrappedDstTokens[k2], IERC20(address(uint160(uint256(connectors_[j]))))) returns (uint256 rate, uint256 weight) {
                                rate = rate.mul(srcRates[k1]).mul(dstRates[k2]).div(1e36);
                                weight = weight.mul(weight);
                                weightedRate = weightedRate.add(rate.mul(weight));
                                totalWeight = totalWeight.add(weight);
                            } catch {}  // solhint-disable-line no-empty-blocks
                        }
                    }
                }
            }
        }
        if (totalWeight > 0) {
            weightedRate = weightedRate.div(totalWeight);
        }
    }

    /// @dev Same as `getRate` but checks against `ETH` and `WETH` only
    function getRateToEth(IERC20 srcToken, bool useSrcWrappers) external view returns (uint256 weightedRate) {
        uint256 totalWeight;
        (IERC20[] memory wrappedSrcTokens, uint256[] memory srcRates) = _getWrappedTokens(srcToken, useSrcWrappers);
        IERC20[2] memory wrappedDstTokens = [_BASE, _wBase];
        bytes32[][2] memory wrappedOracles = [_ethOracles._inner._values, _wethOracles._inner._values];
        bytes32[] memory connectors_ = _connectors._inner._values;

        unchecked {
            for (uint256 k1 = 0; k1 < wrappedSrcTokens.length; k1++) {
                for (uint256 k2 = 0; k2 < wrappedDstTokens.length; k2++) {
                    if (wrappedSrcTokens[k1] == wrappedDstTokens[k2]) {
                        return srcRates[k1];
                    }
                    for (uint256 j = 0; j < connectors_.length; j++) {
                        IERC20 connector = IERC20(address(uint160(uint256(connectors_[j]))));
                        if (connector == wrappedSrcTokens[k1] || connector == wrappedDstTokens[k2]) {
                            continue;
                        }
                        for (uint256 i = 0; i < wrappedOracles[k2].length; i++) {
                            try IOracle(address(uint160(uint256(wrappedOracles[k2][i])))).getRate(wrappedSrcTokens[k1], wrappedDstTokens[k2], connector) returns (uint256 rate, uint256 weight) {
                                rate = rate.mul(srcRates[k1]).div(1e18);
                                weight = weight.mul(weight);
                                weightedRate = weightedRate.add(rate.mul(weight));
                                totalWeight = totalWeight.add(weight);
                            } catch {}  // solhint-disable-line no-empty-blocks
                        }
                    }
                }
            }
        }
        if (totalWeight > 0) {
            weightedRate = weightedRate.div(totalWeight);
        }
    }

    function _getWrappedTokens(IERC20 token, bool useWrappers) internal view returns (IERC20[] memory wrappedTokens, uint256[] memory rates) {
        if (useWrappers) {
            return multiWrapper.getWrappedTokens(token);
        }

        wrappedTokens = new IERC20[](1);
        wrappedTokens[0] = token;
        rates = new uint256[](1);
        rates[0] = uint256(1e18);
    }
}
