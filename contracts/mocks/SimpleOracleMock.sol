// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../interfaces/IOracle.sol";

contract SimpleOracleMock is IOracle {
    uint256 public rate;
    uint256 public weitght;

    constructor(uint256 _rate, uint256 _weight) {
        rate = _rate;
        weitght = _weight;
    }

    function getRate(IERC20 /*srcToken*/, IERC20 /*dstToken*/, IERC20 /*connector*/, uint256 /*thresholdFilter*/) external override view returns (uint256, uint256) {
        return (rate, weitght);
    }

    function setRateAndWeight(uint256 _rate, uint256 _weight) external {
        rate = _rate;
        weitght = _weight;
    }
}
