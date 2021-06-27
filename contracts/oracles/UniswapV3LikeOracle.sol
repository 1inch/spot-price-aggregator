// SPDX-License-Identifier: MIT

pragma solidity 0.7.6;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../interfaces/IOracle.sol";
import "../libraries/Sqrt.sol";
import "../interfaces/IUniswapV3Pool.sol";

contract UniswapV3LikeOracle is IOracle {
    using SafeMath for uint256;
    using Sqrt for uint256;

    mapping(IERC20 => mapping(IERC20 => IUniswapV3Pool)) private token0ToToken1ToUniswapV3Pool;
    IERC20 private constant _ETH = IERC20(0x0000000000000000000000000000000000000000);
    IERC20 private constant _NONE = IERC20(0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF);

    constructor(IERC20[] memory tokens0, IERC20[] memory tokens1, IUniswapV3Pool[] memory pools) {
        require(tokens0.length == tokens1.length, "UniV3O: invalid tokens length");
        require(tokens0.length == pools.length, "UniV3O: invalid pools length");
        for (uint i = 0; i < tokens0.length; i++) {
            require(address(tokens0[i]) == pools[i].token0(), "UniV3O: token source mismatch");
            require(address(tokens1[i]) == pools[i].token1(), "UniV3O: token source mismatch");
            token0ToToken1ToUniswapV3Pool[tokens0[i]][tokens1[i]] = pools[i];
        }
    }

    function getRate(IERC20 srcToken, IERC20 dstToken, IERC20 connector) external view override returns (uint256 rate, uint256 weight) {
        if (connector == _NONE) {
            return _getRate(srcToken, dstToken);
        }

        (uint256 rate0, uint256 liquidity0) = _getRate(srcToken, connector);
        (uint256 rate1, uint256 liquidity1) = _getRate(connector, dstToken);
        if (rate0 > rate1) {
            rate = rate0.mul(1e18).div(rate1);
        } else {
            rate = rate1.mul(1e18).div(rate0);
        }
        weight = liquidity0.mul(liquidity1).sqrt();
    }

    function _getRate(IERC20 srcToken, IERC20 dstToken) internal view returns (uint256 rate, uint256 liquidity) {
        IUniswapV3Pool pool = token0ToToken1ToUniswapV3Pool[srcToken][dstToken];
        (uint160 sqrtPriceX96,,,,,, ) = pool.slot0();
        return (sqrtPriceX96, pool.liquidity());
    }
}
