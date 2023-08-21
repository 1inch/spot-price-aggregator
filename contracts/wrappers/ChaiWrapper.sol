// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import "../interfaces/IChai.sol";
import "./BaseCoinWrapper.sol";

contract ChaiWrapper is BaseCoinWrapper {
    uint256 private constant _ONE = 10 ** 27;
    uint256 private constant _RAY = 10 ** 27;

    IChaiPot public immutable POT;

    constructor(IERC20 base, IERC20 wBase, IChaiPot pot) BaseCoinWrapper(base, wBase) {
        POT = pot;
    }

    function _wrap() internal view override returns (IERC20 wrappedToken, uint256 rate) {
        return (WBASE, _rdiv(1e18, _calcChi()));
    }

    function _unwrap() internal view override returns (IERC20 unwrappedToken, uint256 rate) {
        return (BASE, _rmul(_calcChi(), 1e18));
    }

    function _calcChi() internal view returns (uint256 chi) {
        uint256 rho = POT.rho();
        chi = POT.chi();
        if (block.timestamp > rho) {
            chi = _rmul(_rpow(POT.dsr(), block.timestamp - rho, _ONE), chi);
        }
    }

    function _rdiv(uint x, uint y) internal pure returns (uint z) {
        z = x * _RAY / y;
    }

    function _rmul(uint x, uint y) internal pure returns (uint z) {
        z = x * y / _ONE;
    }

    function _rpow(uint x, uint n, uint base) internal pure returns (uint z) {
        assembly ("memory-safe") { // solhint-disable-line no-inline-assembly
            switch x case 0 {switch n case 0 {z := base} default {z := 0}}
            default {
                switch mod(n, 2) case 0 { z := base } default { z := x }
                let half := div(base, 2)  // for rounding.
                for { n := div(n, 2) } n { n := div(n,2) } {
                    let xx := mul(x, x)
                    if iszero(eq(div(xx, x), x)) { revert(0,0) }
                    let xxRound := add(xx, half)
                    if lt(xxRound, xx) { revert(0,0) }
                    x := div(xxRound, base)
                    if mod(n,2) {
                        let zx := mul(z, x)
                        if and(iszero(iszero(x)), iszero(eq(div(zx, x), z))) { revert(0,0) }
                        let zxRound := add(zx, half)
                        if lt(zxRound, zx) { revert(0,0) }
                        z := div(zxRound, base)
                    }
                }
            }
        }
    }
}
