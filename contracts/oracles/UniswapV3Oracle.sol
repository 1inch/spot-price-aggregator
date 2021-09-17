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

    bytes32 public immutable poolInitCodeHash;
    address public constant FACTORY = 0x1F98431c8aD98523631AE4a59f267346ea31F984;
    IERC20 private constant _NONE = IERC20(0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF);

    constructor(bytes32 _poolInitCodeHash) {
        poolInitCodeHash = _poolInitCodeHash;
    }

    function getRate(IERC20 srcToken, IERC20 dstToken, IERC20 connector) external override view returns (uint256 rate, uint256 weight) {
        uint24[3] memory fees = [uint24(500), 3000, 10000];

        if (connector == _NONE) {
            for (uint256 i = 0; i < 3; i++) {
                (uint256 rate0, uint256 b1, uint256 b2) = _getRate(srcToken, dstToken, fees[i]);
                uint256 w = b1.mul(b2);
                rate = rate.add(rate0.mul(w));
                weight = weight.add(w);
            }
        } else {
            for (uint256 i = 0; i < 3; i++) {
                for (uint256 j = 0; j < 3; j++) {
                    (uint256 rate0, uint256 b1, uint256 bc1) = _getRate(srcToken, connector, fees[i]);
                    if (b1 == 0 || bc1 == 0) {
                        return (0, 0);
                    }
                    (uint256 rate1, uint256 bc2, uint256 b2) = _getRate(connector, dstToken, fees[j]);
                    if (bc2 == 0 || b2 == 0) {
                        return (0, 0);
                    }

                    if (bc2 > bc1) {
                        (bc1, bc2) = (bc2, bc1);
                    }
                    uint256 w = b1.mul(b2).mul(bc1).div(bc2);

                    rate = rate.add(rate0.mul(rate1).div(1e18).mul(w));
                    weight = weight.add(w);
                }
            }
        }

        if (weight > 0) {
            rate = rate.div(weight);
            weight = weight.sqrt();
        }
    }

    function _getRate(IERC20 srcToken, IERC20 dstToken, uint24 fee) internal view returns (uint256 rate, uint256 srcBalance, uint256 dstBalance) {
        (IERC20 token0, IERC20 token1) = srcToken < dstToken ? (srcToken, dstToken) : (dstToken, srcToken);
        address pool = _getPool(address(token0), address(token1), fee);
        if (!pool.isContract() || IUniswapV3Pool(pool).liquidity() == 0) {
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

    function _getPool(address token0, address token1, uint24 fee) private view returns (address) {
        return address(
            uint256(
                keccak256(
                    abi.encodePacked(
                        hex'ff',
                        FACTORY,
                        keccak256(abi.encode(token0, token1, fee)),
                        poolInitCodeHash
                    )
                )
            )
        );
    }
}
