// SPDX-License-Identifier: MIT

pragma solidity 0.8.15;
pragma abicoder v1;

import "./OracleBase.sol";
import "../interfaces/ISolidlyFactory.sol";
import "../interfaces/IOracle.sol";
import "../interfaces/IUniswapV2Pair.sol";
import "../libraries/Sqrt.sol";

contract SolidlyOracleNoCreate2 is IOracle {
    using Sqrt for uint256;

    ISolidlyFactory public immutable factory;

    IERC20 private constant _NONE = IERC20(0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF);

    constructor(ISolidlyFactory _factory) {
        factory = _factory;
    }

    function getRate(IERC20 srcToken, IERC20 dstToken, IERC20 connector) external view override returns (uint256 rate, uint256 weight) {
        require(connector == _NONE, "SO: connector should be None");
        for (uint256 i = 1; i < 2; i++) {
            (uint256 b0, uint256 b1) = _getBalances(srcToken, dstToken, i == 0 ? true : false);
            uint256 w = (b0 * b1).sqrt();
            rate = rate + b1 * 1e18 / b0 * w;
            weight = weight + w;
        }

        if (weight > 0) {
            unchecked { rate /= weight; }
        }
    }

    function _getBalances(IERC20 srcToken, IERC20 dstToken, bool stable) internal view returns (uint256 srcBalance, uint256 dstBalance) {
        (IERC20 token0, IERC20 token1) = srcToken < dstToken ? (srcToken, dstToken) : (dstToken, srcToken);
        (uint256 reserve0, uint256 reserve1,) = IUniswapV2Pair(factory.getPair(token0, token1, stable)).getReserves();
        (srcBalance, dstBalance) = srcToken == token0 ? (reserve0, reserve1) : (reserve1, reserve0);
    }
}
