// SPDX-License-Identifier: MIT

pragma solidity 0.8.23;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../oracles/OracleBase.sol";

/**
 * @notice Deterministic test subclass of {OracleBase}.
 * @dev The whole rate/weight logic for the constant-product oracle family lives in
 *      `OracleBase.getRate`. By overriding `_getBalances` with caller-provided reserves we can
 *      drive that logic with arbitrary balances (representing tokens of arbitrary decimals)
 *      without a mainnet fork, and assert the returned `weight` directly.
 */
contract OracleBaseMock is OracleBase {
    mapping(bytes32 => uint256) private _srcBalance;
    mapping(bytes32 => uint256) private _dstBalance;

    function _key(IERC20 a, IERC20 b) private pure returns (bytes32) {
        return keccak256(abi.encodePacked(a, b));
    }

    /// @notice Sets the pool reserves for the ordered pair (a, b) and its reverse (b, a).
    function setBalances(IERC20 a, IERC20 b, uint256 balA, uint256 balB) external {
        _srcBalance[_key(a, b)] = balA;
        _dstBalance[_key(a, b)] = balB;
        _srcBalance[_key(b, a)] = balB;
        _dstBalance[_key(b, a)] = balA;
    }

    function _getBalances(IERC20 srcToken, IERC20 dstToken) internal view override returns (uint256 srcBalance, uint256 dstBalance) {
        bytes32 key = _key(srcToken, dstToken);
        return (_srcBalance[key], _dstBalance[key]);
    }
}
