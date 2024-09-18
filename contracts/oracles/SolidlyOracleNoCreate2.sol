// SPDX-License-Identifier: MIT

pragma solidity 0.8.23;

import "@openzeppelin/contracts/utils/math/Math.sol";
import "./OracleBase.sol";
import "../interfaces/ISolidlyFactory.sol";
import "../interfaces/IOracle.sol";
import "./SolidlyOracle.sol";
import "../interfaces/IUniswapV2Pair.sol";
import "../libraries/OraclePrices.sol";

contract SolidlyOracleNoCreate2 is SolidlyOracle {
    using OraclePrices for OraclePrices.Data;
    using Math for uint256;

    ISolidlyFactory public immutable _FACTORY;

    IERC20 private constant _NONE = IERC20(0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF);

    constructor(address _factory) SolidlyOracle(_factory, bytes32(0)) {
        _FACTORY = ISolidlyFactory(_factory);
    }

    function _getBalances(IERC20 srcToken, IERC20 dstToken, bool stable) internal view override returns (uint256 srcBalance, uint256 dstBalance) {
        (IERC20 token0, IERC20 token1) = srcToken < dstToken ? (srcToken, dstToken) : (dstToken, srcToken);
        (bool success, bytes memory data) = _FACTORY.getPair(token0, token1, stable).staticcall(abi.encodeWithSelector(IUniswapV2Pair.getReserves.selector));
        if (success && data.length == 96) {
            (srcBalance, dstBalance) = abi.decode(data, (uint256, uint256));
            (srcBalance, dstBalance) = srcToken == token0 ? (srcBalance, dstBalance) : (dstBalance, srcBalance);
        } else {
            (srcBalance, dstBalance) = (1, 0);
        }
    }
}