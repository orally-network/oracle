// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract MerkleProofVerifier {
//    function hashAssetData(
//        string memory symbol,
//        uint64 price,
//        uint64 timestamp
//    ) public pure returns (bytes32) {
//        bytes32 symbolHash = keccak256(abi.encodePacked(symbol));
//        bytes32 priceHash = keccak256(abi.encodePacked(price));
//        bytes32 timestampHash = keccak256(abi.encodePacked(timestamp));
//
//        return keccak256(abi.encodePacked(symbolHash, priceHash, timestampHash));
//    }

    function hashAssetData(
        string memory symbol,
        uint64 price,
        uint64 timestamp
    ) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(symbol, price, timestamp));
    }

    function verifyProof(
        bytes32[] memory proof,
        bytes32 root,
        string memory symbol,
        uint64 price,
        uint64 timestamp
    ) public pure returns (bool) {
        bytes32 leaf = hashAssetData(symbol, price, timestamp);
        return MerkleProof.verify(proof, root, leaf);
    }
}