// SPDX-License-Identifier: MIT

pragma solidity 0.7.6;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "./OracleBase.sol";
import "../interfaces/IChainlink.sol";

contract ChainlinkOracle is OracleBase {
    using Address for address;

    IChainlink public immutable chainlink;
    address private constant _QUOTE = address(0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE);
    IERC20 private constant _ETH = IERC20(0x0000000000000000000000000000000000000000);
    uint256  private constant _RATE_TTL = 1 days;

    constructor(IChainlink _chainlink) {
        chainlink = _chainlink;
    }

    function _getBalances(IERC20 srcToken, IERC20 dstToken) internal view override returns (uint256 srcBalance, uint256 dstBalance) {
        int256 srcAnswer;
        if (srcToken != _ETH) {
            (, int256 answer, , uint256 srcUpdatedAt, ) = chainlink.latestRoundData(srcToken, _QUOTE);
            require(block.timestamp < srcUpdatedAt + _RATE_TTL, "CO: src rate too old");
            srcAnswer = answer;
        } else {
            srcAnswer = 1e19;
        }
        int256 dstAnswer;
        if (dstToken != _ETH) {
            (, int256 answer, , uint256 dstUpdatedAt, ) = chainlink.latestRoundData(dstToken, _QUOTE);
            require(block.timestamp < dstUpdatedAt + _RATE_TTL, "CO: dst rate too old");
            dstAnswer = answer;
        } else {
            dstAnswer = 1e19;
        }
        return (uint256(srcAnswer), uint256(dstAnswer));
    }
}
