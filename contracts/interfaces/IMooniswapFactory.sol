// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import "./IMooniswap.sol";

interface IMooniswapFactory {
    function pools(IERC20 token0, IERC20 token1) external view returns (IMooniswap);
}
