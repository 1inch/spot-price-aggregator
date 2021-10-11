// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;
pragma abicoder v1;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../interfaces/IOracle.sol";
import "../interfaces/IKyberDmmFactory.sol";
import "../interfaces/IKyberDmmPool.sol";
import "../libraries/Sqrt.sol";


contract KyberDmmOracle is IOracle {
    using SafeMath for uint256;
    using Sqrt for uint256;

    IKyberDmmFactory public immutable factory;

    constructor(IKyberDmmFactory _factory) {
        factory = _factory;
    }

    IERC20 private constant _NONE = IERC20(0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF);

    function getRate(IERC20 srcToken, IERC20 dstToken, IERC20 connector) external override view returns (uint256 rate, uint256 weight) {
        unchecked {
            if (connector == _NONE) {
                address[] memory pools = factory.getPools(srcToken, dstToken);

                require(pools.length > 0, "KO: no pools");

                for (uint256 i = 0; i < pools.length; i++) {
                    (uint256 b0, uint256 b1) = _getBalances(srcToken, dstToken, pools[i]);

                    uint256 w = b0.mul(b1);
                    rate = rate.add(b1.mul(1e18).div(b0).mul(w));
                    weight = weight.add(w);
                }
            } else {
                address[] memory pools0 = factory.getPools(srcToken, connector);
                address[] memory pools1 = factory.getPools(connector, dstToken);

                require(pools0.length > 0 && pools1.length > 0, "KO: no pools with connector");

                for (uint256 i = 0; i < pools0.length; i++) {
                    for (uint256 j = 0; j < pools1.length; j++) {
                        (uint256 b0, uint256 bc0) = _getBalances(srcToken, connector, pools0[i]);
                        (uint256 bc1, uint256 b1) = _getBalances(connector, dstToken, pools1[j]);

                        if (bc0 > bc1) {
                            b0 = b0.mul(bc1).div(bc0);
                        } else {
                            b1 = b1.mul(bc0).div(bc1);
                        }

                        uint256 w = b0.mul(b1);
                        rate = rate.add(b1.mul(1e18).div(b0).mul(w));
                        weight = weight.add(w);
                    }
                }
            }

            if (weight > 0) {
                rate = rate.div(weight);
                weight = weight.sqrt();
            }
        }
    }

    function _getBalances(IERC20 srcToken, IERC20 dstToken, address pool) private view returns (uint256 srcBalance, uint256 dstBalance) {
        (, , srcBalance, dstBalance,) = IKyberDmmPool(pool).getTradeInfo();
        if (srcToken > dstToken) {
            (srcBalance, dstBalance) = (dstBalance, srcBalance);
        }
    }
}
