// SPDX-License-Identifier: MIT

pragma solidity 0.8.23;

// solhint-disable func-name-mixedcase

interface ICurvePool {
    function allowed_extra_profit() external view returns (uint256);
    function get_rate_mul() external view returns (uint256);
}

interface IStableSwapMeta {
    function get_dy_underlying(int128,int128,uint256) external view returns (uint256);
}

interface IStableSwap {
    function get_dy(int128,int128,uint256) external view returns (uint256);
}

interface ICryptoSwap {
    function get_dy(uint256,uint256,uint256) external view returns (uint256);
}
