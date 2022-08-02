// SPDX-License-Identifier: MIT

pragma solidity 0.8.14;
pragma abicoder v1;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";


interface IDodoZoo {
    function getDODO(address baseToken, address quoteToken) external view returns (address);
}

