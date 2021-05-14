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

    EnumerableSet.AddressSet private _oracles;
    EnumerableSet.AddressSet private _connectors;
    MultiWrapper public multiWrapper;

    IERC20 private constant _BASE = IERC20(0x0000000000000000000000000000000000000000);
    IERC20 private immutable _wBase;

    constructor(MultiWrapper _multiWrapper, IOracle[] memory existingOracles, IERC20[] memory existingConnectors, IERC20 wBase) {
        multiWrapper = _multiWrapper;
        emit MultiWrapperUpdated(_multiWrapper);
        for (uint256 i = 0; i < existingOracles.length; i++) {
            require(_oracles.add(address(existingOracles[i])), "Oracle already added");
            emit OracleAdded(existingOracles[i]);
        }
        for (uint256 i = 0; i < existingConnectors.length; i++) {
            require(_connectors.add(address(existingConnectors[i])), "Connector already added");
            emit ConnectorAdded(existingConnectors[i]);
        }
        _wBase = wBase;
    }

    function oracles() external view returns (IOracle[] memory allOracles) {
        allOracles = new IOracle[](_oracles.length());
        for (uint256 i = 0; i < allOracles.length; i++) {
            allOracles[i] = IOracle(uint256(_oracles._inner._values[i]));
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

    function addOracle(IOracle oracle) external onlyOwner {
        require(_oracles.add(address(oracle)), "Oracle already added");
        emit OracleAdded(oracle);
    }

    function removeOracle(IOracle oracle) external onlyOwner {
        require(_oracles.remove(address(oracle)), "Unknown oracle");
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
    function getRate(IERC20 srcToken, IERC20 dstToken) external view returns (uint256 weightedRate) {
        require(srcToken != dstToken, "Tokens should not be the same");
        uint256 totalWeight;
        (IERC20[] memory wrappedSrcTokens, uint256[] memory srcRates) = multiWrapper.getWrappedTokens(srcToken);
        (IERC20[] memory wrappedDstTokens, uint256[] memory dstRates) = multiWrapper.getWrappedTokens(dstToken);

        for (uint256 k1 = 0; k1 < wrappedSrcTokens.length; k1++) {
            for (uint256 k2 = 0; k2 < wrappedDstTokens.length; k2++) {
                if (wrappedSrcTokens[k1] == wrappedDstTokens[k2]) {
                    return srcRates[k1].mul(dstRates[k2]).div(1e18);
                }
                for (uint256 i = 0; i < _oracles._inner._values.length; i++) {
                    for (uint256 j = 0; j < _connectors._inner._values.length; j++) {
                        try IOracle(uint256(_oracles._inner._values[i])).getRate(wrappedSrcTokens[k1], wrappedDstTokens[k2], IERC20(uint256(_connectors._inner._values[j]))) returns (uint256 rate, uint256 weight) {
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
    function getRateToEth(IERC20 srcToken) external view returns (uint256 weightedRate) {
        uint256 totalWeight;
        (IERC20[] memory wrappedSrcTokens, uint256[] memory srcRates) = multiWrapper.getWrappedTokens(srcToken);
        (IERC20[2] memory wrappedDstTokens, uint256[2] memory dstRates) = ([_BASE, _wBase], [uint256(1e18), uint256(1e18)]);

        for (uint256 k1 = 0; k1 < wrappedSrcTokens.length; k1++) {
            for (uint256 k2 = 0; k2 < wrappedDstTokens.length; k2++) {
                if (wrappedSrcTokens[k1] == wrappedDstTokens[k2]) {
                    return srcRates[k1].mul(dstRates[k2]).div(1e18);
                }
                for (uint256 i = 0; i < _oracles._inner._values.length; i++) {
                    for (uint256 j = 0; j < _connectors._inner._values.length; j++) {
                        try IOracle(uint256(_oracles._inner._values[i])).getRate(wrappedSrcTokens[k1], wrappedDstTokens[k2], IERC20(uint256(_connectors._inner._values[j]))) returns (uint256 rate, uint256 weight) {
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

    /// @dev Get direct rate between tokens. Unlike GetRate doesn't check against wrappers
    function getRateDirect(IERC20 srcToken, IERC20 dstToken) external view returns (uint256 weightedRate) {
        require(srcToken != dstToken, "Tokens should not be the same");
        uint256 totalWeight;

        for (uint256 i = 0; i < _oracles._inner._values.length; i++) {
            for (uint256 j = 0; j < _connectors._inner._values.length; j++) {
                try IOracle(uint256(_oracles._inner._values[i])).getRate(srcToken, dstToken, IERC20(uint256(_connectors._inner._values[j]))) returns (uint256 rate, uint256 weight) {
                    rate = rate.mul(1e18).mul(1e18).div(1e18).div(1e18);
                    weight = weight.mul(weight);
                    weightedRate = weightedRate.add(rate.mul(weight));
                    totalWeight = totalWeight.add(weight);
                } catch {continue;}
            }
        }
        weightedRate = weightedRate.div(totalWeight);
    }
}
