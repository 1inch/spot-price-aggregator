// SPDX-License-Identifier: MIT

pragma solidity 0.7.6;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../interfaces/IOracle.sol";
import "../interfaces/IKyberDmmFactory.sol";
import "../interfaces/IKyberDmmPool.sol";
import "../libraries/Sqrt.sol";


contract KyberDmmOracle is IOracle {
    using SafeMath for uint256;
    using Sqrt for uint256;

    IKyberDmmFactory public immutable factory;

    struct Balances {
        uint256 srcToken;
        uint256 dstToken;
        uint256 dstConnector;
        uint256 srcConnector;
    }

    constructor(IKyberDmmFactory _factory) {
        factory = _factory;
    }

    IERC20 private constant _NONE = IERC20(0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF);

    function getRate(IERC20 srcToken, IERC20 dstToken, IERC20 connector) external override view returns (uint256 rate, uint256 weight) {
        Balances memory b;
        if (connector == _NONE) {
            address[] memory pools = factory.getPools(srcToken, dstToken);
            
            require(pools.length > 0, "KO: there are no pools");
            
            for (uint256 i = 0; i < pools.length; i++) {
                (b.srcToken, b.dstToken) = _getBalances(srcToken, IKyberDmmPool(pools[i]));
                
                uint256 poolRate = b.dstToken.mul(1e18).div(b.srcToken);
                uint256 poolWeight = b.srcToken.mul(b.dstToken);
                
                rate = rate.add(poolRate.mul(poolWeight));
                weight = weight.add(poolWeight);
            }
        } else {
            address[] memory poolsConnector0 = factory.getPools(srcToken, connector);
            address[] memory poolsConnector1 = factory.getPools(connector, dstToken);
            
            require(poolsConnector0.length > 0 && poolsConnector1.length > 0, "KO: there are no pools with connector");

            uint256 rateConnector;
            uint256 weightConnector;
            for (uint256 i = 0; i < poolsConnector0.length; i++) {
                for (uint256 j = 0; j < poolsConnector1.length; j ++) {
                    (b.srcToken, b.dstConnector) = _getBalances(srcToken, IKyberDmmPool(poolsConnector0[i]));
                    (b.srcConnector, b.dstToken) = _getBalances(connector, IKyberDmmPool(poolsConnector1[j]));
                    if (b.dstConnector > b.srcConnector) {
                        b.srcToken = b.srcToken.mul(b.srcConnector).div(b.dstConnector);
                    } else {
                        b.dstToken = b.dstToken.mul(b.dstConnector).div(b.srcConnector);
                    }

                    rateConnector = b.dstToken.mul(1e18).div(b.srcToken);
                    // rateConnector = b.dstToken.mul(1e18).div(b.srcToken);
                    weightConnector = b.srcToken.mul(b.dstToken);
                    
                    rate = rate.add(rateConnector.mul(weightConnector));
                    weight = weight.add(weightConnector);
                }
            }
        }

        if (weight > 0) {
            rate = rate.div(weight);
            weight = weight.sqrt();
        }
    }

    function _getBalances(IERC20 srcToken, IKyberDmmPool pool) internal view virtual returns (uint256 srcBalance, uint256 dstBalance) {
        (, , srcBalance, dstBalance,) = pool.getTradeInfo();
        if (srcToken == pool.token1()) {
            (srcBalance, dstBalance) = (dstBalance, srcBalance);
        }
    }
}
