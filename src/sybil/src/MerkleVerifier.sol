pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract AssetDataStoreVerifier {
    bytes32 public root;

    struct AssetData {
        string symbol;
        uint256 price;
        uint256 timestamp;
    }

    function setRoot(bytes32 _root) external {
        root = _root;
    }

    function verify(
        AssetData calldata assetData,
        bytes32[] calldata proof
    ) external view returns (bool) {
        bytes32 leaf = keccak256(abi.encode(assetData));
        return MerkleProof.verify(proof, root, leaf);
    }
}
