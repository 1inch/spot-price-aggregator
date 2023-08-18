// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import "../interfaces/ISDai.sol";
import "../interfaces/IWrapper.sol";

contract SDaiWrapper is IWrapper {
    IERC20 private immutable _DAI;
    ISDai private immutable _SDAI;

    constructor(ISDai sDai, IERC20 dai) {
        _SDAI = sDai;
        _DAI = dai;
    }

    function wrap(IERC20 token) external view override returns (IERC20 wrappedToken, uint256 rate) {
        if (token == _DAI) {
            return (IERC20(address(_SDAI)), _SDAI.previewDeposit(1e18));
        } else if (token == IERC20(address(_SDAI))) {
            return (_DAI, _SDAI.previewRedeem(1e18));
        } else {
            revert NotSupportedToken();
        }
    }
}
