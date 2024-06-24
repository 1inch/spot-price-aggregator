// SPDX-License-Identifier: MIT

pragma solidity 0.8.23;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Blacklist is Ownable {
    mapping(address => bool) public blacklisted;

    constructor(address owner) Ownable(owner) {}

    event BlacklistAddress(address pool, bool isBlacklisted);

    function toggleBlacklistAddress(address pool) external onlyOwner {
        blacklisted[pool] = !blacklisted[pool];
        emit BlacklistAddress(pool, blacklisted[pool]);
    }
}
