// SPDX-License-Identifier: MIT

pragma solidity 0.8.11;
pragma abicoder v1;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../interfaces/IOracle.sol";
import "../libraries/Sqrt.sol";

import "../interfaces/ICurveRegistry.sol";
import "../interfaces/ICurveProvider.sol";
import "../interfaces/ICurveSwap.sol";

contract CurveOracle is IOracle {
    using Sqrt for uint256;

    ICurveProvider public immutable addressProvider;
    IERC20 private constant _NONE = IERC20(0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF);

    constructor(ICurveProvider _addressProvider) {
        addressProvider = _addressProvider;
    }

    function getRate(IERC20 _srcToken, IERC20 _dstToken, IERC20 connector) external view override returns (uint256 rate, uint256 weight) {

        require(connector == _NONE, "connector should be NONE");

        address registryAddress = addressProvider.get_address(0);
        ICurveRegistry registry = ICurveRegistry(registryAddress);

        address pool;
        pool = registry.find_pool_for_coins(address(_srcToken), address(_dstToken));
        require(pool != address(0), "Pool does not exist");

        int128 a;
        int128 b;
        bool underlying;
        (a, b, underlying) = registry.get_coin_indices(pool, address(_srcToken), address(_dstToken));

        if (underlying) {
            rate = ICurveSwap(pool).get_dy(a, b, 1e6) * 1e12;
        } else {
            rate = ICurveSwap(pool).get_dy_underlying(a, b, 1e6) * 1e12;
        }
        require(rate != 0, "Swap rate not available");
        
        uint256 srcBalance = _srcToken.balanceOf(pool);
        uint256 dstBalance = _dstToken.balanceOf(pool);

        weight = (srcBalance * dstBalance).sqrt();
    }
}
