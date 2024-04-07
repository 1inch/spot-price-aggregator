// SPDX-License-Identifier: MIT

pragma solidity 0.8.23;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// STATA_TOKENS in AaveV3
interface IStaticATokenLM {
    function aToken() external view returns (IERC20);
    function rate() external view returns (uint256);
}

interface IStaticATokenFactory {
    function getStaticAToken(address underlying) external view returns (address);
    function getStaticATokens() external view returns (address[] memory);
}
