// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;
pragma abicoder v1;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../interfaces/IChainlink.sol";
import "../interfaces/IOracle.sol";

contract ChainlinkOracle is IOracle {
    using SafeMath for uint256;

    IChainlink public immutable chainlink;
    address private constant _QUOTE = address(0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE);
    IERC20 private constant _ETH = IERC20(0x0000000000000000000000000000000000000000);
    IERC20 private constant _NONE = IERC20(0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF);
    uint256 private constant _RATE_TTL = 1 days;

    constructor(IChainlink _chainlink) {
        chainlink = _chainlink;
    }

    function getRate(IERC20 srcToken, IERC20 dstToken, IERC20 connector) external view override returns (uint256 rate, uint256 weight) {
        require(connector == _NONE, "CO: connector should be None");
        (uint256 srcAnswer, uint8 srcDecimals) = srcToken != _ETH ? _getRate(srcToken) : (1e18, 18);
        (uint256 dstAnswer, uint8 dstDecimals) = dstToken != _ETH ? _getRate(dstToken) : (1e18, 18);
        rate = srcAnswer.mul(1e18).div(dstAnswer);
        weight = 1e6 * 10 ** ((uint256(srcDecimals).add(dstDecimals)).div(2));
    }

    function _getRate(IERC20 token) private view returns (uint256 rate, uint8 decimals) {
        (, int256 answer, , uint256 srcUpdatedAt, ) = chainlink.latestRoundData(token, _QUOTE);
        unchecked {
            require(block.timestamp < srcUpdatedAt + _RATE_TTL, "CO: rate too old");
        }
        rate = uint256(answer);
        decimals = ERC20(address(token)).decimals();
        rate = rate * (10 ** (uint256(18).sub(decimals)));
    }
}
