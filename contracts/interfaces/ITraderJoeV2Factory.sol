// SPDX-License-Identifier: MIT

pragma solidity 0.8.23;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface ITraderJoeV2Factory {
    struct LBPairInformation {
        uint16 binStep;
        address LBPair;
        bool createdByOwner;
        bool ignoredForRouting;
    }

    function getAllBinSteps() external view returns (uint256[] memory binStepWithPreset);
    function getAllLBPairs(IERC20 tokenX, IERC20 tokenY) external view returns (LBPairInformation[] memory lbPairsAvailable);
}
