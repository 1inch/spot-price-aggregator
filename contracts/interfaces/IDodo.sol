// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// solhint-disable private-vars-leading-underscore
// solhint-disable func-name-mixedcase

interface IDodo {
    function _BASE_BALANCE_() external view returns (uint256);
    function _QUOTE_BALANCE_() external view returns (uint256);
    function getMidPrice() external view returns (uint256 midPrice);
}

interface IDVM {
    function _BASE_RESERVE_() external view returns (uint256);
    function _QUOTE_RESERVE_() external view returns (uint256);
    function getMidPrice() external view returns (uint256 midPrice);
}
