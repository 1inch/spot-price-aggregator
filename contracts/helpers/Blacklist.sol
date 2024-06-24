// SPDX-License-Identifier: MIT

pragma solidity 0.8.23;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Blacklist is Ownable {
    event BlacklistUpdated(address pool, bool isBlacklisted);

    mapping(address => bool) public blacklisted;

    constructor(address[] memory initialBlacklist, address owner) Ownable(owner) {
        for (uint256 i = 0; i < initialBlacklist.length; i++) {
            blacklisted[initialBlacklist[i]] = true;
        }
    }

    function toggleBlacklistAddress(address pool) external onlyOwner {
        blacklisted[pool] = !blacklisted[pool];
        emit BlacklistUpdated(pool, blacklisted[pool]);
    }
}
