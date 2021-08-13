// SPDX-License-Identifier: MIT

pragma solidity 0.7.6;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../interfaces/ISynthetix.sol";
import "../interfaces/ISynthetixProxy.sol";
import "../interfaces/ISynthAddressResolver.sol";
import "../interfaces/IOracle.sol";

contract SynthetixOracle is IOracle {
    using SafeMath for uint256;

    ISynthetix public immutable synth;
    ISynthetixProxy public immutable proxy;
    IERC20 private constant _ETH = IERC20(0x0000000000000000000000000000000000000000);
    IERC20 private constant _NONE = IERC20(0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF);
    uint256 private constant _RATE_TTL = 1 days;

    constructor(ISynthetix _synth, ISynthetixProxy _proxy) {
        synth = _synth;
        proxy = _proxy;
    }

    function getRate(IERC20 srcToken, IERC20 dstToken, IERC20 connector) external view override returns (uint256 rate, uint256 weight) {
        require(connector == _NONE, "SO: connector should be None");
        uint256 srcAnswer = srcToken != _ETH ? _getRate(address(srcToken)) : 1e18;
        uint256 dstAnswer = dstToken != _ETH ? _getRate(address(dstToken)) : 1e18;
        rate = srcAnswer.mul(1e18).div(dstAnswer);
        weight = 1e24;
    }

    function _getRate(address token) private view returns(uint256) {
        string memory dstSymbol = ERC20(token).symbol();
        bytes32 dstCurrencyKey;
        assembly { // solhint-disable-line no-inline-assembly
            dstCurrencyKey := mload(add(dstSymbol, 32))
        }
        ISynthAddressResolver resolver = ISynthAddressResolver(proxy.target());
        require(resolver.getSynth(dstCurrencyKey) == token, "SO: key is diff from token");
        (uint256 answer, uint256 dstUpdatedAt) = synth.rateAndUpdatedTime(dstCurrencyKey);
        require(block.timestamp < dstUpdatedAt + _RATE_TTL, "SO: dst rate too old");
        return answer;
    }
}
