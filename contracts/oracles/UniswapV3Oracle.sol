// SPDX-License-Identifier: MIT

pragma solidity 0.7.6;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../interfaces/IOracle.sol";
import "../interfaces/IUniswapV3Factory.sol";
import "../interfaces/IUniswapV3Pool.sol";
import "../libraries/Sqrt.sol";


contract UniswapV3Oracle is IOracle {
    using SafeMath for uint256;
    using Sqrt for uint256;

    IUniswapV3Factory public immutable factory;
    IERC20 private constant _NONE = IERC20(0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF);
    uint24[] private _defaultFees;

    constructor(IUniswapV3Factory _factory, uint24[] memory defaultFees) {
        factory = _factory;
        _defaultFees = defaultFees;
    }

    function getRate(IERC20 srcToken, IERC20 dstToken, IERC20 connector) external override view returns (uint256 rate, uint256 weight) {
        for (uint256 i = 0; i < _defaultFees.length; i++) {
            (uint256 rateForFee, uint256 weightForFee) = getRateForFee(srcToken, dstToken, connector, _defaultFees[i]);
            rate = rate.add(rateForFee.mul(weightForFee));
            weight = weight.add(weightForFee);
        }
        rate = rate.div(weight);
    }

    // @dev fee in ppm (e.g. 3000 for 0.3% fee)
    function getRateForFee(IERC20 srcToken, IERC20 dstToken, IERC20 connector, uint24 fee) public view returns (uint256 rate, uint256 weight) {
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

    function _getRate(IERC20 srcToken, IERC20 dstToken, uint24 fee) internal view returns (uint256 rate, uint256 srcBalance, uint256 dstBalance) {
        IUniswapV3Pool pool = factory.getPool(srcToken, dstToken, fee);
        require(pool != IUniswapV3Pool(0), "UNI3O: Cannot find a pool");
        (uint256 sqrtPriceX96,,,,,,) = pool.slot0();
        if (srcToken == pool.token0()) {
            rate = (uint256(1e18).mul(sqrtPriceX96) >> 96).mul(sqrtPriceX96) >> 96;
        } else {
            rate = uint256(1e18 << 192).div(sqrtPriceX96).div(sqrtPriceX96);
        }
        srcBalance = srcToken.balanceOf(address(pool));
        dstBalance = dstToken.balanceOf(address(pool));
    }
}
