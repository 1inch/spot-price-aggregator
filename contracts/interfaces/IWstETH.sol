// SPDX-License-Identifier: MIT

pragma solidity 0.8.23;

interface IWstETH {
    function tokensPerStEth() external view returns (uint256);
    function stEthPerToken() external view returns (uint256);
}

