// SPDX-License-Identifier: MIT

pragma solidity 0.8.10;
pragma abicoder v1;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";


interface IKyberDmmFactory {
    function getPools(IERC20 token0, IERC20 token1) external view returns (address[] memory _tokenPools);
}
