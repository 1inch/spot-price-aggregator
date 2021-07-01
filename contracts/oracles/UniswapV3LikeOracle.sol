// SPDX-License-Identifier: MIT

pragma solidity 0.7.6;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../interfaces/IOracle.sol";
import "../libraries/Sqrt.sol";
import "../interfaces/IUniswapV3Pool.sol";
import "../interfaces/IUniswapV3Factory.sol";
import "../interfaces/IERC20Minimal.sol";

import "hardhat/console.sol";

contract UniswapV3LikeOracle is IOracle {
    using SafeMath for uint256;
    using SafeMath for uint160;
    using Sqrt for uint256;

    IUniswapV3Factory public immutable factory;
    address private constant _NONE = address(0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF);
    uint24[] private defaultFees;

    constructor(IUniswapV3Factory _factory, uint24[] memory _defaultFees) {
        factory = _factory;
        defaultFees = _defaultFees;
    }

    function getRate(IERC20 srcToken, IERC20 dstToken, IERC20 connector) external override view returns (uint256 rate, uint256 weight) {
        uint256 weightedRate = 0;
        uint256 totalWeight = 0;
        for (uint256 i = 0; i < defaultFees.length; i++) {
            (uint256 rate_i, uint256 weight_i) = getRateForFee(address(srcToken), address(dstToken), address(connector), defaultFees[i]);
            weightedRate = weightedRate.add(rate_i.mul(weight_i));
            totalWeight = totalWeight.add(weight_i);
        }
        rate = weightedRate.div(totalWeight);
        weight = totalWeight;
    }

    // @dev fee in ppm (e.g. 3000 for 0.3% fee)
    function getRateForFee(address srcToken, address dstToken, address connector, uint24 fee) public view returns (uint256 rate, uint256 weight) {
        uint256 balance0;
        uint256 balance1;
        if (connector == _NONE) {
            (rate, balance0, balance1) = _getRate(srcToken, dstToken, fee);
        } else {
            uint256 balanceConnector0;
            uint256 balanceConnector1;
            uint256 rate0;
            uint256 rate1;
            (rate0, balance0, balanceConnector0) = _getRate(srcToken, connector, fee);
            (rate1, balanceConnector1, balance1) = _getRate(connector, dstToken, fee);
            if (balanceConnector0 > balanceConnector1) {
                balance0 = balance0.mul(balanceConnector1).div(balanceConnector0);
            } else {
                balance1 = balance1.mul(balanceConnector0).div(balanceConnector1);
            }

            rate = rate0.mul(rate1).div(1e18);
        }

        weight = balance0.mul(balance1).sqrt();
    }

    function _getRate(address srcToken, address dstToken, uint24 fee) internal view returns (uint256 rate, uint256 srcBalance, uint256 dstBalance) {
        IUniswapV3Pool pool = IUniswapV3Pool(factory.getPool(srcToken, dstToken, fee));
        require(address(pool) != address(0), "UNI3O: Cannot find a pool");
        (uint160 sqrtPriceX96,,,,,, ) = pool.slot0();
        uint256 sqrtPriceScaled = uint256(sqrtPriceX96).mul(1e18) >> 96;
        rate = sqrtPriceScaled.mul(sqrtPriceScaled).div(1e18);
        if (dstToken == pool.token0()) {
            rate = uint256(1e18*1e18).div(rate);
        }
        srcBalance = balance(pool, srcToken);
        dstBalance = balance(pool, dstToken);
    }

    function balance(IUniswapV3Pool pool, address token) private view returns (uint256) {
        (bool success, bytes memory data) =
        token.staticcall(abi.encodeWithSelector(IERC20Minimal.balanceOf.selector, address(pool)));
        require(success && data.length >= 32);
        return abi.decode(data, (uint256));
    }
}
