// SPDX-License-Identifier: MIT

pragma solidity 0.7.6;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/EnumerableSet.sol";
import "./interfaces/IOracle.sol";
import "./interfaces/IWrapper.sol";
import "./MultiWrapper.sol";

contract OffchainOracle is Ownable {
    using SafeMath for uint256;
    using EnumerableSet for EnumerableSet.AddressSet;

    event OracleAdded(IOracle oracle);
    event OracleRemoved(IOracle oracle);
    event ConnectorAdded(IERC20 connector);
    event ConnectorRemoved(IERC20 connector);
    event MultiWrapperUpdated(MultiWrapper multiWrapper);

    EnumerableSet.AddressSet private _wethOracles;
    EnumerableSet.AddressSet private _ethOracles;
    EnumerableSet.AddressSet private _connectors;
    MultiWrapper public multiWrapper;

    IERC20 private constant _BASE = IERC20(0x0000000000000000000000000000000000000000);
    IERC20 private immutable _wBase;

    constructor(MultiWrapper _multiWrapper, IOracle[] memory existingOracles, Types.OracleTokenKind[] memory oracleKinds, IERC20[] memory existingConnectors, IERC20 wBase) {
        require(existingOracles.length == oracleKinds.length);
        multiWrapper = _multiWrapper;
        emit MultiWrapperUpdated(_multiWrapper);
        for (uint256 i = 0; i < existingOracles.length; i++) {
            if (oracleKinds[i] == Types.OracleTokenKind.WETH) {
                require(_wethOracles.add(address(existingOracles[i])), "Oracle already added");
            } else if (oracleKinds[i] == Types.OracleTokenKind.ETH) {
                require(_ethOracles.add(address(existingOracles[i])), "Oracle already added");
            } else if (oracleKinds[i] == Types.OracleTokenKind.WETH_ETH) {
                require(_wethOracles.add(address(existingOracles[i])), "Oracle already added");
                require(_ethOracles.add(address(existingOracles[i])), "Oracle already added");
            } else {
                revert("Invalid OracleTokenKind");
            }
            emit OracleAdded(existingOracles[i]);
        }
        for (uint256 i = 0; i < existingConnectors.length; i++) {
            require(_connectors.add(address(existingConnectors[i])), "Connector already added");
            emit ConnectorAdded(existingConnectors[i]);
        }
        _wBase = wBase;
    }

    function oracles() public view returns (IOracle[] memory allOracles, Types.OracleTokenKind[] memory oracleKinds) {
        IOracle[] memory oraclesBuffer = new IOracle[](_wethOracles._inner._values.length + _ethOracles._inner._values.length);
        Types.OracleTokenKind[] memory oracleKindsBuffer = new Types.OracleTokenKind[](oraclesBuffer.length);
        for (uint256 i = 0; i < _wethOracles._inner._values.length; i++) {
            oraclesBuffer[i] = IOracle(uint256(_wethOracles._inner._values[i]));
            oracleKindsBuffer[i] = Types.OracleTokenKind.WETH;
        }

        uint256 actualItemsCount = _wethOracles._inner._values.length;

        for (uint256 i = 0; i < _ethOracles._inner._values.length; i++) {
            Types.OracleTokenKind kind = Types.OracleTokenKind.ETH;
            uint256 oracleIndex = actualItemsCount;
            IOracle oracle = IOracle(uint256(_ethOracles._inner._values[i]));
            for (uint j = 0; j < oraclesBuffer.length; j++) {
                if (oraclesBuffer[j] == oracle) {
                    oracleIndex = j;
                    kind = Types.OracleTokenKind.WETH_ETH;
                    break;
                }
            }
            if (kind == Types.OracleTokenKind.ETH) {
                actualItemsCount++;
            }
            oraclesBuffer[oracleIndex] = oracle;
            oracleKindsBuffer[oracleIndex] = kind;
        }

        allOracles = new IOracle[](actualItemsCount);
        oracleKinds = new Types.OracleTokenKind[](actualItemsCount);
        for (uint256 i = 0; i < actualItemsCount; i++) {
            allOracles[i] = oraclesBuffer[i];
            oracleKinds[i] = oracleKindsBuffer[i];
        }
    }

    function connectors() external view returns (IERC20[] memory allConnectors) {
        allConnectors = new IERC20[](_connectors.length());
        for (uint256 i = 0; i < allConnectors.length; i++) {
            allConnectors[i] = IERC20(uint256(_connectors._inner._values[i]));
        }
    }

    function setMultiWrapper(MultiWrapper _multiWrapper) external onlyOwner {
        multiWrapper = _multiWrapper;
        emit MultiWrapperUpdated(_multiWrapper);
    }

    function addOracle(IOracle oracle, Types.OracleTokenKind oracleKind) external onlyOwner {
        if (oracleKind == Types.OracleTokenKind.WETH) {
            require(_wethOracles.add(address(oracle)), "Oracle already added");
        } else if (oracleKind == Types.OracleTokenKind.ETH) {
            require(_ethOracles.add(address(oracle)), "Oracle already added");
        } else if (oracleKind == Types.OracleTokenKind.WETH_ETH) {
            require(_wethOracles.add(address(oracle)), "Oracle already added");
            require(_ethOracles.add(address(oracle)), "Oracle already added");
        } else {
            revert("Invalid OracleTokenKind");
        }
        emit OracleAdded(oracle);
    }

    function removeOracle(IOracle oracle, Types.OracleTokenKind oracleKind) external onlyOwner {
        if (oracleKind == Types.OracleTokenKind.WETH) {
            require(_wethOracles.remove(address(oracle)), "Unknown oracle");
        } else if (oracleKind == Types.OracleTokenKind.ETH) {
            require(_ethOracles.remove(address(oracle)), "Unknown oracle");
        } else if (oracleKind == Types.OracleTokenKind.WETH_ETH) {
            require(_wethOracles.remove(address(oracle)), "Unknown oracle");
            require(_ethOracles.remove(address(oracle)), "Unknown oracle");
        } else {
            revert("Invalid OracleTokenKind");
        }
        emit OracleRemoved(oracle);
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
    function getRate(IERC20 srcToken, IERC20 dstToken, bool useSrcWrappers, bool useDstWrappers) external view returns (uint256 weightedRate) {
        require(srcToken != dstToken, "Tokens should not be the same");
        uint256 totalWeight;
        (IOracle[] memory allOracles, ) = oracles();
        (IERC20[] memory wrappedSrcTokens, uint256[] memory srcRates) = getWrappedTokens(srcToken, useSrcWrappers);
        (IERC20[] memory wrappedDstTokens, uint256[] memory dstRates) = getWrappedTokens(dstToken, useDstWrappers);

        for (uint256 k1 = 0; k1 < wrappedSrcTokens.length; k1++) {
            for (uint256 k2 = 0; k2 < wrappedDstTokens.length; k2++) {
                if (wrappedSrcTokens[k1] == wrappedDstTokens[k2]) {
                    return srcRates[k1].mul(dstRates[k2]).div(1e18);
                }
                for (uint256 i = 0; i < allOracles.length; i++) {
                    for (uint256 j = 0; j < _connectors._inner._values.length; j++) {
                        try allOracles[i].getRate(wrappedSrcTokens[k1], wrappedDstTokens[k2], IERC20(uint256(_connectors._inner._values[j]))) returns (uint256 rate, uint256 weight) {
                            rate = rate.mul(srcRates[k1]).mul(dstRates[k2]).div(1e18).div(1e18);
                            weight = weight.mul(weight);
                            weightedRate = weightedRate.add(rate.mul(weight));
                            totalWeight = totalWeight.add(weight);
                        } catch {continue;}
                    }
                }
            }
        }
        weightedRate = weightedRate.div(totalWeight);
    }

    /// @dev Same as `getRate` but checks against `ETH` and `WETH` only
    function getRateToEth(IERC20 srcToken, bool useSrcWrappers) external view returns (uint256 weightedRate) {
        uint256 totalWeight;
        (IERC20[] memory wrappedSrcTokens, uint256[] memory srcRates) = getWrappedTokens(srcToken, useSrcWrappers);
        IERC20[2] memory wrappedDstTokens = [_BASE, _wBase];
        bytes32[][2] memory wrappedOracles = [_ethOracles._inner._values, _wethOracles._inner._values];

        for (uint256 k1 = 0; k1 < wrappedSrcTokens.length; k1++) {
            for (uint256 k2 = 0; k2 < wrappedDstTokens.length; k2++) {
                if (wrappedSrcTokens[k1] == wrappedDstTokens[k2]) {
                    return srcRates[k1];
                }
                for (uint256 i = 0; i < wrappedOracles[k2].length; i++) {
                    for (uint256 j = 0; j < _connectors._inner._values.length; j++) {
                        try IOracle(uint256(wrappedOracles[k2][i])).getRate(wrappedSrcTokens[k1], wrappedDstTokens[k2], IERC20(uint256(_connectors._inner._values[j]))) returns (uint256 rate, uint256 weight) {
                            rate = rate.mul(srcRates[k1]).div(1e18);
                            weight = weight.mul(weight);
                            weightedRate = weightedRate.add(rate.mul(weight));
                            totalWeight = totalWeight.add(weight);
                        } catch {continue;}
                    }
                }
            }
        }
        weightedRate = weightedRate.div(totalWeight);
    }

    function getWrappedTokens(IERC20 token, bool useWrappers) internal view returns (IERC20[] memory wrappedTokens, uint256[] memory rates) {
        if (useWrappers) {
            return multiWrapper.getWrappedTokens(token);
        }

        wrappedTokens = new IERC20[](1);
        wrappedTokens[0] = token;
        rates = new uint256[](1);
        rates[0] = uint256(1e18);
    }
}

library Types {
    enum OracleTokenKind
    {
        WETH,
        ETH,
        WETH_ETH
    }
}
