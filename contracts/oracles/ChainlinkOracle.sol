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
    uint256  private constant _RATE_TTL = 1 days;

    constructor(IChainlink _chainlink) {
        chainlink = _chainlink;
    }

    function _getBalances(IERC20 srcToken, IERC20 dstToken) internal view override returns (uint256 srcBalance, uint256 dstBalance) {
        (, int256 srcAnswer, , uint256 srcUpdatedAt, ) = chainlink.latestRoundData(srcToken, _QUOTE);
        require(block.timestamp < srcUpdatedAt + _RATE_TTL, "CO: src rate too old");
        (, int256 dstAnswer, , uint256 dstUpdatedAt, ) = chainlink.latestRoundData(dstToken, _QUOTE);
        require(block.timestamp < dstUpdatedAt + _RATE_TTL, "CO: dst rate too old");
        return (uint256(srcAnswer), uint256(dstAnswer));
    }
}
