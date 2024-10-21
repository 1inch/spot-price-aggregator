// SPDX-License-Identifier: MIT

pragma solidity 0.8.23;

import "./SDaiWrapper.sol";

contract WsuperOETHbWrapper is SDaiWrapper {
    constructor(IERC20 base, IERC20 wBase) SDaiWrapper(base, wBase) {} // solhint-disable-line no-empty-blocks
}
