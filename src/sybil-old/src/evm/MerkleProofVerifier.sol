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
        uint64 timestamp,
        uint64 decimals
    ) public pure returns (bytes32) {
        return keccak256(bytes.concat(keccak256(abi.encode(symbol, price, timestamp, decimals))));
    }

    function verifyProof(
        bytes32[] memory proof,
        string memory symbol,
        uint64 price,
        uint64 timestamp,
        uint64 decimals
    ) public view returns (bool) {
        bytes32 leaf = hashAssetData(symbol, price, timestamp, decimals);

        return MerkleProof.verify(proof, root, leaf);
    }
}