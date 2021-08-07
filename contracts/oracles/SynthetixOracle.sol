// SPDX-License-Identifier: MIT

pragma solidity 0.7.6;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "../interfaces/ISynthetix.sol";
import "../interfaces/IOracle.sol";
import "../interfaces/IERC20Detailed.sol";

contract SynthetixOracle is IOracle {
    using Address for address;
    using SafeMath for uint256;

    ISynthetix public immutable synth;
    IERC20 private constant _ETH = IERC20(0x0000000000000000000000000000000000000000);
    IERC20 private constant _NONE = IERC20(0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF);
    uint256 private constant _RATE_TTL = 1 days;

    constructor(ISynthetix _synth) {
        synth = _synth;
    }

    function getRate(IERC20 srcToken, IERC20 dstToken, IERC20 connector) external view override returns (uint256 rate, uint256 weight) {
        require(connector == _NONE, "SynthOracle: connector should be None");

        uint256 srcAnswer;
        if (srcToken != _ETH) {
        	string memory srcSymbol = IERC20Detailed(address(srcToken)).symbol();
        	bytes32 srcCurrencyKey;
        	assembly {
		        srcCurrencyKey := mload(add(srcSymbol, 32))
		    }
            
            (uint answer, uint srcUpdatedAt) = synth.rateAndUpdatedTime(srcCurrencyKey);

            require(block.timestamp < srcUpdatedAt + _RATE_TTL, "SynthOracle: src rate too old");

            srcAnswer = uint256(answer);
        } else {
            srcAnswer = 1e18;
        }

        uint256 dstAnswer;
        if (dstToken != _ETH) {
        	string memory dstSymbol = IERC20Detailed(address(dstToken)).symbol();
        	bytes32 dstCurrencyKey;
        	assembly {
		        dstCurrencyKey := mload(add(dstSymbol, 32))
		    }

            (uint answer, uint dstUpdatedAt) = synth.rateAndUpdatedTime(dstCurrencyKey);

            require(block.timestamp < dstUpdatedAt + _RATE_TTL, "SynthOracle: dst rate too old");
            
            dstAnswer = uint256(answer);
        } else {
            dstAnswer = 1e18;
        }

        rate = srcAnswer.mul(1e18).div(dstAnswer);
        weight = 1e24;
    }
}