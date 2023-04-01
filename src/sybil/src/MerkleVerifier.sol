pragma solidity ^0.8.0;

contract MerkleVerifier {
    struct AssetData {
        string symbol;
        uint256 price;
        uint256 timestamp;
    }

    function computeHash(AssetData memory assetData) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(assetData.symbol, assetData.price, assetData.timestamp));
    }

    function verifyProof(
        AssetData memory assetData,
        bytes32[] memory proof,
        bytes32 root
    ) public pure returns (bool) {
        bytes32 dataHash = computeHash(assetData);
        bytes32 computedHash = dataHash;

        for (uint256 i = 0; i < proof.length; i++) {
            if (computedHash < proof[i]) {
                computedHash = keccak256(abi.encodePacked(computedHash, proof[i]));
            } else {
                computedHash = keccak256(abi.encodePacked(proof[i], computedHash));
            }
        }

        return computedHash == root;
    }
}