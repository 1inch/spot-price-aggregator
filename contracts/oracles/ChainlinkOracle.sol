// SPDX-License-Identifier: MIT

pragma solidity 0.7.6;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "../interfaces/IChainlink.sol";
import "../interfaces/IOracle.sol";

contract ChainlinkOracle is IOracle {
    using Address for address;
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

        uint256 srcAnswer;
        if (srcToken != _ETH) {
            (, int256 answer, , uint256 srcUpdatedAt, ) = chainlink.latestRoundData(srcToken, _QUOTE);
            require(block.timestamp < srcUpdatedAt + _RATE_TTL, "CO: src rate too old");
            srcAnswer = uint256(answer);
        } else {
            srcAnswer = 1e18;
        }

        uint256 dstAnswer;
        if (dstToken != _ETH) {
            (, int256 answer, , uint256 dstUpdatedAt, ) = chainlink.latestRoundData(dstToken, _QUOTE);
            require(block.timestamp < dstUpdatedAt + _RATE_TTL, "CO: dst rate too old");
            dstAnswer = uint256(answer);
        } else {
            dstAnswer = 1e18;
        }

        rate = srcAnswer.mul(1e18).div(dstAnswer);
        weight = 1e24;
    }
}
