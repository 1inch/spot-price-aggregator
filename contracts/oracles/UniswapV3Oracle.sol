// SPDX-License-Identifier: MIT

pragma solidity 0.7.6;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "../interfaces/IOracle.sol";
import "../interfaces/IUniswapV3Pool.sol";
import "../libraries/Sqrt.sol";


contract UniswapV3Oracle is IOracle {
    using Address for address;
    using SafeMath for uint256;
    using Sqrt for uint256;

    bytes32 public constant POOL_INIT_CODE_HASH = 0x0c231002d0970d2126e7e00ce88c3b0e5ec8e48dac71478d56245c34ea2f9447;
    address public constant FACTORY = 0x1F98431c8aD98523631AE4a59f267346ea31F984;
    IERC20 private constant _NONE = IERC20(0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF);

    function getRate(IERC20 srcToken, IERC20 dstToken, IERC20 connector) external override view returns (uint256 rate, uint256 weight) {
        uint24[3] memory fees = [uint24(500), 3000, 10000];
        for (uint256 i = 0; i < 3; i++) {
            (uint256 rateForFee, uint256 weightForFee) = getRateForFee(srcToken, dstToken, connector, fees[i]);
            rate = rate.add(rateForFee.mul(weightForFee));
            weight = weight.add(weightForFee);
        }
        if (weight > 0) {
            rate = rate.div(weight);
            weight = weight.sqrt();
        }
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
            if (balance0 == 0 || balanceConnector0 == 0) {
                return (0, 0);
            }
            (rate1, balanceConnector1, balance1) = _getRate(connector, dstToken, fee);
            if (balanceConnector1 == 0 || balance1 == 0) {
                return (0, 0);
            }

            if (balanceConnector0 > balanceConnector1) {
                balance0 = balance0.mul(balanceConnector1).div(balanceConnector0);
            } else {
                balance1 = balance1.mul(balanceConnector0).div(balanceConnector1);
            }

            rate = rate0.mul(rate1).div(1e18);
        }

        weight = balance0.mul(balance1);
    }

    function _getRate(IERC20 srcToken, IERC20 dstToken, uint24 fee) internal view returns (uint256 rate, uint256 srcBalance, uint256 dstBalance) {
        (IERC20 token0, IERC20 token1) = srcToken < dstToken ? (srcToken, dstToken) : (dstToken, srcToken);
        address pool = _getPool(address(token0), address(token1), fee);
        if (!pool.isContract()) {
            return (0, 0, 0);
        }
        (uint256 sqrtPriceX96,,,,,,) = IUniswapV3Pool(pool).slot0();
        if (srcToken == token0) {
            rate = (uint256(1e18).mul(sqrtPriceX96) >> 96).mul(sqrtPriceX96) >> 96;
        } else {
            rate = uint256(1e18 << 192).div(sqrtPriceX96).div(sqrtPriceX96);
        }
        srcBalance = srcToken.balanceOf(address(pool));
        dstBalance = dstToken.balanceOf(address(pool));
    }

    function _getPool(address token0, address token1, uint24 fee) private pure returns (address) {
        return address(
            uint256(
                keccak256(
                    abi.encodePacked(
                        hex'ff',
                        FACTORY,
                        keccak256(abi.encode(token0, token1, fee)),
                        POOL_INIT_CODE_HASH
                    )
                )
            )
        );
    }
}
