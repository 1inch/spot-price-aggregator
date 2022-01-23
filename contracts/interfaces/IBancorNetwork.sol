// SPDX-License-Identifier: MIT

pragma solidity 0.8.11;
pragma abicoder v1;

import "@openzeppelin/contracts/interfaces/IERC20.sol";

interface IBancorNetwork {
    function rateByPath(address[] memory _path, uint256 _amount) external view returns (uint256);
    function conversionPath(IERC20 _sourceToken, IERC20 _targetToken) external view returns (address[] memory);
}
