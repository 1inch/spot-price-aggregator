// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeCast.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "../interfaces/IChainlink.sol";
import "../interfaces/IOracle.sol";

contract ChainlinkOracle is IOracle {
    using SafeCast for int256;

    error RateTooOld();

    IChainlink public immutable chainlink;
    address private constant _QUOTE = address(0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE);
    IERC20 private constant _ETH = IERC20(0x0000000000000000000000000000000000000000);
    IERC20 private constant _NONE = IERC20(0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF);
    uint256 private constant _RATE_TTL = 1 days;

    constructor(IChainlink _chainlink) {
        chainlink = _chainlink;
    }

    function getRate(IERC20 srcToken, IERC20 dstToken, IERC20 connector, uint256 /*thresholdFilter*/) external view override returns (uint256 rate, uint256 weight) {
        unchecked {
            if(connector != _NONE) revert ConnectorShouldBeNone();
            (uint256 srcAnswer, uint8 srcDecimals) = srcToken != _ETH ? _getRate(srcToken) : (1e18, 18);
            (uint256 dstAnswer, uint8 dstDecimals) = dstToken != _ETH ? _getRate(dstToken) : (1e18, 18);
            rate = Math.mulDiv(srcAnswer, 1e18, dstAnswer);
            weight = 1e6 * (10 ** ((srcDecimals + dstDecimals) / 2));
        }
    }

    function _getRate(IERC20 token) private view returns (uint256 rate, uint8 decimals) {
        unchecked {
            (, int256 answer, , uint256 srcUpdatedAt, ) = chainlink.latestRoundData(token, _QUOTE);
            if(block.timestamp >= srcUpdatedAt + _RATE_TTL) revert RateTooOld();
            rate = answer.toUint256();
            decimals = ERC20(address(token)).decimals();
            rate = rate * (10 ** (18 - decimals));
        }
    }
}
