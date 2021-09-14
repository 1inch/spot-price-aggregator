// SPDX-License-Identifier: MIT

pragma solidity 0.7.6;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../interfaces/IOracle.sol";
import "../interfaces/IKyberDmmRouter.sol";
import "../interfaces/IKyberDmmFactory.sol";
import "../interfaces/IKyberDmmPool.sol";
import "../libraries/Sqrt.sol";


contract KyberDmmOracle is IOracle {
    using SafeMath for uint256;
    using Sqrt for uint256;

    IKyberDmmRouter public immutable router;

    constructor(IKyberDmmRouter _router) {
        router = _router;
    }

    IERC20 private constant _NONE = IERC20(0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF);

    function getRate(IERC20 srcToken, IERC20 dstToken, IERC20 connector) external override view returns (uint256 rate, uint256 weight) {
        require(connector == _NONE, "KO: connector should be None");
        
        IKyberDmmFactory factory = IKyberDmmFactory(router.factory());
        address[] memory pools = factory.getPools(srcToken, dstToken);

        require(pools.length > 0, "KO: there are no pools");
        
        for (uint256 i = 0; i < pools.length; i++) {
            (uint256 poolRate, uint256 poolWeight) = getPoolRate(srcToken, dstToken, pools[i]);
            rate = rate.add(poolRate.mul(poolWeight));
            weight = weight.add(poolWeight);
        }
        if (weight > 0) {
            rate = rate.div(weight);
            weight = weight.sqrt();
        }
    }

    function getPoolRate(IERC20 srcToken, IERC20 dstToken, address pool) public view returns (uint256 rate, uint256 weight) {
        (uint256 balance0, uint256 balance1) = _getBalances(srcToken, dstToken, IKyberDmmPool(pool));
        
        rate = balance1.mul(1e18).div(balance0);
        weight = balance0.mul(balance1).sqrt();
    }

    function _getBalances(IERC20 srcToken, IERC20 dstToken, IKyberDmmPool pool) internal view virtual returns (uint256 srcBalance, uint256 dstBalance) {
        IERC20 token0 = pool.token0();
        IERC20 token1 = pool.token1();
        
        if (address(srcToken) == address(token0) && address(dstToken) == address(token1)) {
            (, , srcBalance, dstBalance,) = pool.getTradeInfo();
            return (srcBalance, dstBalance);
        }

        if (srcToken == token1 && dstToken == token0) {
            (, , dstBalance, srcBalance,) = pool.getTradeInfo();
            return (srcBalance, dstBalance);
        }
        
        revert("KO: tokens do not match the pool");
    }
}
