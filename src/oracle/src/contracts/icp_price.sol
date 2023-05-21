// SPDX-License-Identifier: MIT
pragma solidity >=0.8.7;

contract Counter {
    string public price;
    bytes32 public random;

    function set_price(string memory _price) public {
        price = _price;
    }

    function set_random(bytes32 _random) public {
        random = _random;
    }
}

