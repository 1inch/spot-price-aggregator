pragma solidity 0.8.23;

import "./Wrapper.sol";
import "@openzeppelin/interfaces/IERC4626.sol";

contract USDeWrapper is Wrapper {

    constructor(IERC20 base, IERC20 wBase) Wrapper(base, wBase) {}
    

    function _wrap() internal view virtual override returns (IERC20 wrappedToken, uint256 rate) {
        return (WBASE, IERC4626(address(WBASE)).convertToShares(1e18)); // scale down when minting sUSDe with USDe
    }

    function _unwrap() internal view virtual override returns (IERC20 unwrappedToken, uint256 rate) {
        return (BASE, IERC4626(address(WBASE)).convertToAssets(1e18)); // scale up when redeeming sUSDe for USDe
    }
}