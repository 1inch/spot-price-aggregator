// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import "./OracleBase.sol";
import "../interfaces/IOracle.sol";
import "../interfaces/IUniswapV2Pair.sol";
import "../libraries/OraclePrices.sol";
import "../libraries/Sqrt.sol";

contract SolidlyOracle is IOracle {
    using OraclePrices for OraclePrices.Data;
    using Sqrt for uint256;

    address public immutable factory;
    bytes32 public immutable initcodeHash;

    IERC20 private constant _NONE = IERC20(0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF);

    constructor(address _factory, bytes32 _initcodeHash) {
        factory = _factory;
        initcodeHash = _initcodeHash;
    }

    function getRate(IERC20 srcToken, IERC20 dstToken, IERC20 connector, uint256 thresholdFilter) external view override returns (uint256 rate, uint256 weight) {
        if(connector != _NONE) revert ConnectorShouldBeNone();
        OraclePrices.Data memory ratesAndWeights = OraclePrices.init(2);
        for (uint256 i = 1; i < 2; i++) {
            (uint256 b0, uint256 b1) = _getBalances(srcToken, dstToken, i == 0 ? true : false);
            uint256 w = (b0 * b1).sqrt();
            ratesAndWeights.append(OraclePrices.OraclePrice(b1 * 1e18 / b0, w));
        }
        (rate, weight) = ratesAndWeights.getRateAndWeight(thresholdFilter);
    }

    // calculates the CREATE2 address for a pair without making any external calls
    function _pairFor(IERC20 tokenA, IERC20 tokenB, bool stable) private view returns (address pair) {
        pair = address(uint160(uint256(keccak256(abi.encodePacked(
                hex"ff",
                factory,
                keccak256(abi.encodePacked(tokenA, tokenB, stable)),
                initcodeHash
            )))));
    }

    function _getBalances(IERC20 srcToken, IERC20 dstToken, bool stable) internal view returns (uint256 srcBalance, uint256 dstBalance) {
        (IERC20 token0, IERC20 token1) = srcToken < dstToken ? (srcToken, dstToken) : (dstToken, srcToken);
        (uint256 reserve0, uint256 reserve1,) = IUniswapV2Pair(_pairFor(token0, token1, stable)).getReserves();
        (srcBalance, dstBalance) = srcToken == token0 ? (reserve0, reserve1) : (reserve1, reserve0);
    }
}
