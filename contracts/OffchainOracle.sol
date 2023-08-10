// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "./interfaces/IOracle.sol";
import "./interfaces/IWrapper.sol";
import "./MultiWrapper.sol";
import "./libraries/OraclePrices.sol";

contract OffchainOracle is Ownable {
    using Math for uint256;
    using EnumerableSet for EnumerableSet.AddressSet;
    using OraclePrices for OraclePrices.Data;

    error ArraysLengthMismatch();
    error OracleAlreadyAdded();
    error ConnectorAlreadyAdded();
    error InvalidOracleTokenKind();
    error UnknownOracle();
    error UnknownConnector();
    error SameTokens();
    error TooBigThreshold();

    enum OracleType { WETH, ETH, WETH_ETH }

    event OracleAdded(IOracle oracle, OracleType oracleType);
    event OracleRemoved(IOracle oracle, OracleType oracleType);
    event ConnectorAdded(IERC20 connector);
    event ConnectorRemoved(IERC20 connector);
    event MultiWrapperUpdated(MultiWrapper multiWrapper);

    struct GetRateImplParams {
        IOracle oracle;
        IERC20 srcToken;
        uint256 srcTokenRate;
        IERC20 dstToken;
        uint256 dstTokenRate;
        IERC20 connector;
        uint256 thresholdFilter;
    }

    EnumerableSet.AddressSet private _wethOracles;
    EnumerableSet.AddressSet private _ethOracles;
    EnumerableSet.AddressSet private _connectors;
    MultiWrapper public multiWrapper;

    IERC20 private constant _BASE = IERC20(0x0000000000000000000000000000000000000000);
    IERC20 private immutable _wBase;

    constructor(MultiWrapper _multiWrapper, IOracle[] memory existingOracles, OracleType[] memory oracleTypes, IERC20[] memory existingConnectors, IERC20 wBase, address owner) {
        unchecked {
            if(existingOracles.length != oracleTypes.length) revert ArraysLengthMismatch();
            multiWrapper = _multiWrapper;
            emit MultiWrapperUpdated(_multiWrapper);
            for (uint256 i = 0; i < existingOracles.length; i++) {
                if (oracleTypes[i] == OracleType.WETH) {
                    if(!_wethOracles.add(address(existingOracles[i]))) revert OracleAlreadyAdded();
                } else if (oracleTypes[i] == OracleType.ETH) {
                    if(!_ethOracles.add(address(existingOracles[i]))) revert OracleAlreadyAdded();
                } else if (oracleTypes[i] == OracleType.WETH_ETH) {
                    if(!_wethOracles.add(address(existingOracles[i]))) revert OracleAlreadyAdded();
                    if(!_ethOracles.add(address(existingOracles[i]))) revert OracleAlreadyAdded();
                } else {
                    revert InvalidOracleTokenKind();
                }
                emit OracleAdded(existingOracles[i], oracleTypes[i]);
            }
            for (uint256 i = 0; i < existingConnectors.length; i++) {
                if(!_connectors.add(address(existingConnectors[i]))) revert ConnectorAlreadyAdded();
                emit ConnectorAdded(existingConnectors[i]);
            }
            _wBase = wBase;
        }
        if (owner != msg.sender) transferOwnership(owner);
    }

    /**
    * @notice Returns all registered oracles along with their corresponding oracle types.
    * @return allOracles An array of all registered oracles
    * @return oracleTypes An array of the corresponding types for each oracle
    */
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

    /**
    * @notice Returns an array of all registered connectors.
    * @return allConnectors An array of all registered connectors
    */
    function connectors() external view returns (IERC20[] memory allConnectors) {
        unchecked {
            allConnectors = new IERC20[](_connectors.length());
            for (uint256 i = 0; i < allConnectors.length; i++) {
                allConnectors[i] = IERC20(address(uint160(uint256(_connectors._inner._values[i]))));
            }
        }
    }

    /**
    * @notice Sets the MultiWrapper contract address.
    * @param _multiWrapper The address of the MultiWrapper contract
    */
    function setMultiWrapper(MultiWrapper _multiWrapper) external onlyOwner {
        multiWrapper = _multiWrapper;
        emit MultiWrapperUpdated(_multiWrapper);
    }

    /**
    * @notice Adds a new oracle to the registry with the given oracle type.
    * @param oracle The address of the new oracle to add
    * @param oracleKind The type of the new oracle
    */
    function addOracle(IOracle oracle, OracleType oracleKind) external onlyOwner {
        if (oracleKind == OracleType.WETH) {
            if(!_wethOracles.add(address(oracle))) revert OracleAlreadyAdded();
        } else if (oracleKind == OracleType.ETH) {
            if(!_ethOracles.add(address(oracle))) revert OracleAlreadyAdded();
        } else if (oracleKind == OracleType.WETH_ETH) {
            if(!_wethOracles.add(address(oracle))) revert OracleAlreadyAdded();
            if(!_ethOracles.add(address(oracle))) revert OracleAlreadyAdded();
        } else {
            revert InvalidOracleTokenKind();
        }
        emit OracleAdded(oracle, oracleKind);
    }

    /**
    * @notice Removes an oracle from the registry with the given oracle type.
    * @param oracle The address of the oracle to remove
    * @param oracleKind The type of the oracle to remove
    */
    function removeOracle(IOracle oracle, OracleType oracleKind) external onlyOwner {
        if (oracleKind == OracleType.WETH) {
            if(!_wethOracles.remove(address(oracle))) revert UnknownOracle();
        } else if (oracleKind == OracleType.ETH) {
            if(!_ethOracles.remove(address(oracle))) revert UnknownOracle();
        } else if (oracleKind == OracleType.WETH_ETH) {
            if(!_wethOracles.remove(address(oracle))) revert UnknownOracle();
            if(!_ethOracles.remove(address(oracle))) revert UnknownOracle();
        } else {
            revert InvalidOracleTokenKind();
        }
        emit OracleRemoved(oracle, oracleKind);
    }

    /**
    * @notice Adds a new connector to the registry.
    * @param connector The address of the new connector to add
    */
    function addConnector(IERC20 connector) external onlyOwner {
        if(!_connectors.add(address(connector))) revert ConnectorAlreadyAdded();
        emit ConnectorAdded(connector);
    }

    /**
    * @notice Removes a connector from the registry.
    * @param connector The address of the connector to remove
    */
    function removeConnector(IERC20 connector) external onlyOwner {
        if(!_connectors.remove(address(connector))) revert UnknownConnector();
        emit ConnectorRemoved(connector);
    }

    /**
    * WARNING!
    *    Usage of the dex oracle on chain is highly discouraged!
    *    getRate function can be easily manipulated inside transaction!
    * @notice Returns the weighted rate between two tokens using default connectors, with the option to filter out rates below a certain threshold.
    * @param srcToken The source token
    * @param dstToken The destination token
    * @param useWrappers Boolean flag to use or not use token wrappers
    * @return weightedRate weighted rate between the two tokens
    */
    function getRate(
        IERC20 srcToken,
        IERC20 dstToken,
        bool useWrappers
    ) external view returns (uint256 weightedRate) {
        return getRateWithCustomConnectors(srcToken, dstToken, useWrappers, new IERC20[](0), 0);
    }

    /**
    * WARNING!
    *    Usage of the dex oracle on chain is highly discouraged!
    *    getRate function can be easily manipulated inside transaction!
    * @notice Returns the weighted rate between two tokens using default connectors, with the option to filter out rates below a certain threshold.
    * @param srcToken The source token
    * @param dstToken The destination token
    * @param useWrappers Boolean flag to use or not use token wrappers
    * @param thresholdFilter The threshold percentage (from 0 to 100) used to filter out rates below the threshold
    * @return weightedRate weighted rate between the two tokens
    */
    function getRateWithThreshold(
        IERC20 srcToken,
        IERC20 dstToken,
        bool useWrappers,
        uint256 thresholdFilter
    ) external view returns (uint256 weightedRate) {
        return getRateWithCustomConnectors(srcToken, dstToken, useWrappers, new IERC20[](0), thresholdFilter);
    }

    /**
    * WARNING!
    *    Usage of the dex oracle on chain is highly discouraged!
    *    getRate function can be easily manipulated inside transaction!
    * @notice Returns the weighted rate between two tokens using custom connectors, with the option to filter out rates below a certain threshold.
    * @param srcToken The source token
    * @param dstToken The destination token
    * @param useWrappers Boolean flag to use or not use token wrappers
    * @param customConnectors An array of custom connectors to use
    * @param thresholdFilter The threshold percentage (from 0 to 100) used to filter out rates below the threshold
    * @return weightedRate The weighted rate between the two tokens
    */
    function getRateWithCustomConnectors(
        IERC20 srcToken,
        IERC20 dstToken,
        bool useWrappers,
        IERC20[] memory customConnectors,
        uint256 thresholdFilter
    ) public view returns (uint256 weightedRate) {
        if(srcToken == dstToken) revert SameTokens();
        if(thresholdFilter >= 100) revert TooBigThreshold();
        (IOracle[] memory allOracles, ) = oracles();
        (IERC20[] memory wrappedSrcTokens, uint256[] memory srcRates) = _getWrappedTokens(srcToken, useWrappers);
        (IERC20[] memory wrappedDstTokens, uint256[] memory dstRates) = _getWrappedTokens(dstToken, useWrappers);
        IERC20[][2] memory allConnectors = _getAllConnectors(customConnectors);

        uint256 maxArrLength = wrappedSrcTokens.length * wrappedDstTokens.length * (allConnectors[0].length + allConnectors[1].length) * allOracles.length;
        OraclePrices.Data memory ratesAndWeights = OraclePrices.init(maxArrLength);
        unchecked {
            for (uint256 k1 = 0; k1 < wrappedSrcTokens.length; k1++) {
                for (uint256 k2 = 0; k2 < wrappedDstTokens.length; k2++) {
                    if (wrappedSrcTokens[k1] == wrappedDstTokens[k2]) {
                        return srcRates[k1] * dstRates[k2] / 1e18;
                    }
                    for (uint256 k3 = 0; k3 < 2; k3++) {
                        for (uint256 j = 0; j < allConnectors[k3].length; j++) {
                            IERC20 connector = allConnectors[k3][j];
                            if (connector == wrappedSrcTokens[k1] || connector == wrappedDstTokens[k2]) {
                                continue;
                            }
                            for (uint256 i = 0; i < allOracles.length; i++) {
                                GetRateImplParams memory params = GetRateImplParams({
                                    oracle: allOracles[i],
                                    srcToken: wrappedSrcTokens[k1],
                                    srcTokenRate: srcRates[k1],
                                    dstToken: wrappedDstTokens[k2],
                                    dstTokenRate: dstRates[k2],
                                    connector: connector,
                                    thresholdFilter: thresholdFilter
                                });
                                ratesAndWeights.append(_getRateImpl(params));
                            }
                        }
                    }
                }
            }
            (weightedRate,) = ratesAndWeights.getRateAndWeightWithSafeMath(thresholdFilter);
        }
    }

    /**
    * WARNING!
    *    Usage of the dex oracle on chain is highly discouraged!
    *    getRate function can be easily manipulated inside transaction!
    * @notice The same as `getRate` but checks against `ETH` and `WETH` only
    */
    function getRateToEth(IERC20 srcToken, bool useSrcWrappers) external view returns (uint256 weightedRate) {
        return getRateToEthWithCustomConnectors(srcToken, useSrcWrappers, new IERC20[](0), 0);
    }

    /**
    * WARNING!
    *    Usage of the dex oracle on chain is highly discouraged!
    *    getRate function can be easily manipulated inside transaction!
    * @notice The same as `getRate` but checks against `ETH` and `WETH` only
    */
    function getRateToEthWithThreshold(IERC20 srcToken, bool useSrcWrappers, uint256 thresholdFilter) external view returns (uint256 weightedRate) {
        return getRateToEthWithCustomConnectors(srcToken, useSrcWrappers, new IERC20[](0), thresholdFilter);
    }

    /**
    * WARNING!
    *    Usage of the dex oracle on chain is highly discouraged!
    *    getRate function can be easily manipulated inside transaction!
    * @notice The same as `getRateWithCustomConnectors` but checks against `ETH` and `WETH` only
    */
    function getRateToEthWithCustomConnectors(IERC20 srcToken, bool useSrcWrappers, IERC20[] memory customConnectors, uint256 thresholdFilter) public view returns (uint256 weightedRate) {
        if(thresholdFilter >= 100) revert TooBigThreshold();
        (IERC20[] memory wrappedSrcTokens, uint256[] memory srcRates) = _getWrappedTokens(srcToken, useSrcWrappers);
        IERC20[2] memory wrappedDstTokens = [_BASE, _wBase];
        bytes32[][2] memory wrappedOracles = [_ethOracles._inner._values, _wethOracles._inner._values];
        IERC20[][2] memory allConnectors = _getAllConnectors(customConnectors);

        uint256 maxArrLength = wrappedSrcTokens.length * wrappedDstTokens.length * (allConnectors[0].length + allConnectors[1].length) * (wrappedOracles[0].length + wrappedOracles[1].length);
        OraclePrices.Data memory ratesAndWeights = OraclePrices.init(maxArrLength);
        unchecked {
            for (uint256 k1 = 0; k1 < wrappedSrcTokens.length; k1++) {
                for (uint256 k2 = 0; k2 < wrappedDstTokens.length; k2++) {
                    if (wrappedSrcTokens[k1] == wrappedDstTokens[k2]) {
                        return srcRates[k1];
                    }
                    for (uint256 k3 = 0; k3 < 2; k3++) {
                        for (uint256 j = 0; j < allConnectors[k3].length; j++) {
                            IERC20 connector = allConnectors[k3][j];
                            if (connector == wrappedSrcTokens[k1] || connector == wrappedDstTokens[k2]) {
                                continue;
                            }
                            for (uint256 i = 0; i < wrappedOracles[k2].length; i++) {
                                GetRateImplParams memory params = GetRateImplParams({
                                    oracle: IOracle(address(uint160(uint256(wrappedOracles[k2][i])))),
                                    srcToken: wrappedSrcTokens[k1],
                                    srcTokenRate: srcRates[k1],
                                    dstToken: wrappedDstTokens[k2],
                                    dstTokenRate: 1e18,
                                    connector: connector,
                                    thresholdFilter: thresholdFilter
                                });
                                ratesAndWeights.append(_getRateImpl(params));
                            }
                        }
                    }
                }
            }
            (weightedRate,) = ratesAndWeights.getRateAndWeightWithSafeMath(thresholdFilter);
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

    function _getAllConnectors(IERC20[] memory customConnectors) internal view returns (IERC20[][2] memory allConnectors) {
        IERC20[] memory connectorsZero;
        bytes32[] memory rawConnectors = _connectors._inner._values;
        assembly ("memory-safe") { // solhint-disable-line no-inline-assembly
            connectorsZero := rawConnectors
        }
        allConnectors[0] = connectorsZero;
        allConnectors[1] = customConnectors;
    }

    function _getRateImpl(GetRateImplParams memory p) private view returns (OraclePrices.OraclePrice memory oraclePrice) {
        try p.oracle.getRate(p.srcToken, p.dstToken, p.connector, p.thresholdFilter) returns (uint256 rate, uint256 weight) {
            uint256 result = _scaledMul([p.srcTokenRate, rate, p.dstTokenRate], 1e18);
            oraclePrice = OraclePrices.OraclePrice(result, result == 0 ? 0 : weight);
        } catch {}  // solhint-disable-line no-empty-blocks
    }

    function _tryAdd(uint256 value, uint256 addition) private pure returns (bool, uint256) {
        unchecked {
            uint256 result = value + addition;
            if (result < value) return (false, value);
            return (true, result);
        }
    }

    function _scaledMul(uint256[3] memory m, uint256 scale) private pure returns (uint256) {
        if (m[0] == 0 || m[1] == 0 || m[2] == 0) return 0;

        if (m[0] > m[1]) (m[0], m[1]) = (m[1], m[0]);
        if (m[0] > m[2]) (m[0], m[2]) = (m[2], m[0]);
        if (m[1] > m[2]) (m[1], m[2]) = (m[2], m[1]);
        bool scaleApplied;

        unchecked {
            uint256 r = m[0] * m[1];
            if (r / m[0] != m[1]) {
                if (!_validatateMulDiv(m[0], m[1], scale)) return 0;
                r = m[0].mulDiv(m[1], scale);
                scaleApplied = true;
            }
            uint256 r2 = r * m[2];
            if (r2 / r != m[2]) {
                if (!_validatateMulDiv(r, m[2], scaleApplied ? scale : scale * scale)) return 0;
                r2 = r.mulDiv(m[2], scaleApplied ? scale : scale * scale);
            } else {
                r2 /= scaleApplied ? scale : scale * scale;
            }
            return r2;
        }
    }

    /// @dev mulDiv validation is required as we do not want our methods to revert
    function _validatateMulDiv(uint256 x, uint256 y, uint256 denominator) private pure returns (bool) {
        uint256 prod0; // Least significant 256 bits of the product
        uint256 prod1; // Most significant 256 bits of the product
        // solhint-disable-next-line no-inline-assembly
        assembly ("memory-safe") {
            let mm := mulmod(x, y, not(0))
            prod0 := mul(x, y)
            prod1 := sub(sub(mm, prod0), lt(mm, prod0))
        }

        // Make sure the result is less than 2^256
        return denominator > prod1;
    }
}
