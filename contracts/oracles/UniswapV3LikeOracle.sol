// SPDX-License-Identifier: MIT

pragma solidity 0.7.6;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../interfaces/IOracle.sol";
import "../libraries/Sqrt.sol";
import "../interfaces/IUniswapV3Pool.sol";
import "../interfaces/IUniswapV3Factory.sol";

contract UniswapV3LikeOracle {
    using SafeMath for uint256;
    using SafeMath for uint160;
    using Sqrt for uint256;

    IUniswapV3Factory public immutable factory;
    address private constant _NONE = address(0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF);

    constructor(IUniswapV3Factory _factory) {
        factory = _factory;
    }

    // @dev fee in ppm (e.g. 3000 for 0.3% fee)
    function getRate(address srcToken, address dstToken, address connector, uint24 fee) external view returns (uint256 rate, uint256 weight) {
        if (connector == _NONE) {
            return _getRate(srcToken, dstToken, fee);
        }

        (uint256 rate0, uint256 liquidity0) = _getRate(srcToken, connector, fee);
        (uint256 rate1, uint256 liquidity1) = _getRate(connector, dstToken, fee);
        if (rate0 > rate1) {
            rate = rate0.mul(1e18).div(rate1);
        } else {
            rate = rate1.mul(1e18).div(rate0);
        }
        weight = liquidity0.mul(liquidity1).sqrt();
    }

    function _getRate(address srcToken, address dstToken, uint24 fee) internal view returns (uint256 rate, uint256 liquidity) {
        IUniswapV3Pool pool = IUniswapV3Pool(factory.getPool(srcToken, dstToken, fee));
        require(address(pool) != address(0), "UNI3O: Cannot find a pool");
        (uint160 sqrtPriceX96,,,,,, ) = pool.slot0();
        uint256 sqrtPriceScaled = uint256(sqrtPriceX96).mul(1e18) >> 96;
        return (sqrtPriceScaled.mul(sqrtPriceScaled).div(1e18), pool.liquidity());
    }
}
