// SPDX-License-Identifier: MIT
// solhint-disable one-contract-per-file

pragma solidity 0.8.23;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../interfaces/IOracle.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
import "../libraries/OraclePrices.sol";

interface IVelodromeV2Pool {
    function getReserves() external view returns (uint256 _reserve0, uint256 _reserve1, uint256 _timestampLast);
    function token0() external view returns (address);
}

contract VelodromeV2Oracle is IOracle {
    using OraclePrices for OraclePrices.Data;
    using Math for uint256;

    IERC20 private constant _NONE = IERC20(0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF);

    address public immutable POOL_FACTORY;
    address public immutable POOL_IMPLEMENTATION;

    constructor(address _poolFactory, address _poolImplementation) {
        POOL_FACTORY = _poolFactory;
        POOL_IMPLEMENTATION = _poolImplementation;
    }

    function getRate(IERC20 srcToken, IERC20 dstToken, IERC20 connector, uint256 thresholdFilter) external view override returns (uint256 rate, uint256 weight) {
        if (connector == _NONE) {
            (rate, weight) = _getWeightedRate(srcToken, dstToken, thresholdFilter);
        } else {
            (uint256 rateC0, uint256 weightC0) = _getWeightedRate(srcToken, connector, thresholdFilter);
            (uint256 rateC1, uint256 weightC1) = _getWeightedRate(connector, dstToken, thresholdFilter);
            rate = rateC0 * rateC1 / 1e18;
            weight = Math.min(weightC0, weightC1);
        }
    }

    function _getWeightedRate(IERC20 srcToken, IERC20 dstToken, uint256 thresholdFilter) internal view returns (uint256 rate, uint256 weight) {
        OraclePrices.Data memory ratesAndWeights = OraclePrices.init(2);
        uint256 b0;
        uint256 b1;
        (b0, b1) = _getReserves(srcToken, dstToken, true);
        if (b0 > 0) {
            ratesAndWeights.append(OraclePrices.OraclePrice(Math.mulDiv(b1, 1e18, b0), (b0 * b1).sqrt()));
        }
        (b0, b1) = _getReserves(srcToken, dstToken, false);
        if (b0 > 0) {
            ratesAndWeights.append(OraclePrices.OraclePrice(Math.mulDiv(b1, 1e18, b0), (b0 * b1).sqrt()));
        }
        (rate, weight) = ratesAndWeights.getRateAndWeight(thresholdFilter);
    }

    function _getReserves(IERC20 srcToken, IERC20 dstToken, bool stable) internal view returns (uint256 reserveSrc, uint256 reserveDst) {
        (IERC20 token0, IERC20 token1) = srcToken < dstToken ? (srcToken, dstToken) : (dstToken, srcToken);
        address pool = Clones.predictDeterministicAddress({
            implementation: POOL_IMPLEMENTATION,
            salt: keccak256(abi.encodePacked(address(token0), address(token1), stable)),
            deployer: POOL_FACTORY
        });
        try IVelodromeV2Pool(pool).getReserves() returns (uint256 reserve0, uint256 reserve1, uint256) {
            if (srcToken == token0) {
                (reserveSrc, reserveDst) = (reserve0, reserve1);
            } else {
                (reserveSrc, reserveDst) = (reserve1, reserve0);
            }
        } catch {}  // solhint-disable-line no-empty-blocks
    }
}
