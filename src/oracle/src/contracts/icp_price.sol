pragma solidity >=0.8.7;

contract Counter {
    string public price;

    function set_price(string memory _price) public {
        price = _price;
    }

    function getPrice() public view returns (string memory) {
        return price;
    }

}
