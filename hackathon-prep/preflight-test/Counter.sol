// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/// @title Counter — minimal hello-world contract for a Monad testnet pre-flight check.
contract Counter {
    uint256 public count;

    event Incremented(address indexed by, uint256 newCount);

    function increment() external {
        count += 1;
        emit Incremented(msg.sender, count);
    }
}
