// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract MerkleProofVerifier {
    bytes32 public root;

    function setRoot(bytes32 _root) external {
        root = _root;
    }

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