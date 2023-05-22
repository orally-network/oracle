// SPDX-License-Identifier: MIT
pragma solidity >=0.8.7;

contract Counter {
    uint64 public price;
    uint64 public random;
    uint64 public counter = 0;

    function set_price(uint64 _price) public {
        price = _price;
    }

    function set_random(uint64 _random) public {
        random = _random;
    }

    function increment_counter() public {
        counter++;
    }
}

