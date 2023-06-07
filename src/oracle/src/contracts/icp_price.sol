// SPDX-License-Identifier: MIT
pragma solidity >=0.8.7;

struct Feed {
    string pair_id;
    uint256 price;
    uint256 decimals;
    uint256 timestamp;
}

contract Counter {
    Feed public feed;
    uint64 public random;
    uint64 public counter = 0;

    function set_price(
        string memory pair_id,
        uint256 _price,
        uint256 _decimals,
        uint256 _timestamp
    ) public {
        feed = Feed(pair_id, _price, _decimals, _timestamp);
    }

    function set_random(uint64 _random) public {
        random = _random;
    }

    function increment_counter() public {
        counter++;
    }
}

