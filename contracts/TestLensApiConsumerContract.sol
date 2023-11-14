// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.17;

// import "@openzeppelin/contracts/access/Ownable.sol";
import "./PhatRollupAnchor.sol";
import "./polygonZKEVMContracts/PolygonZkEVMBridge.sol";


contract TestLensApiConsumerContract is PhatRollupAnchor{
    // event ResponseReceived(uint reqId, string pair, uint256 value,uint n1,uint n2,string[32] data,string n3,uint n4 ,string n5,uint n6,string n7,uint n8,uint n9);
    event ResponseReceived(
    uint respType,
    uint id,
    uint32 n,
    uint n1,
    bytes32 n2,
    bytes32[32] data,
    bytes n3,
    uint n4,
    address n5,
    uint32 n6,
    address n7,
    uint32 n8,
    bytes32 n9
);

    event ErrorReceived(uint reqId, string pair, uint256 errno,uint n1,uint n2,string n3,uint n4 ,string n5,uint n6,string n7,uint n8,uint n9);

    uint constant TYPE_RESPONSE = 0;
    uint constant TYPE_ERROR = 2;

    mapping(uint => string) requests;
    uint nextRequest = 1;
    constructor(address phatAttestor) {
        _grantRole(PhatRollupAnchor.ATTESTOR_ROLE, phatAttestor);
    }

    function setAttestor(address phatAttestor) public {
        _grantRole(PhatRollupAnchor.ATTESTOR_ROLE, phatAttestor);
    }

    // For test
    function malformedRequest(bytes calldata malformedData) public {
        uint id = nextRequest;
        requests[id] = "malformed_req";
        _pushMessage(malformedData);
        nextRequest += 1;
    }

    function _onMessageReceived(bytes calldata action) internal override {
        require(action.length == 32 * 3, "cannot parse action");
        (uint respType, uint id, uint32 n,uint n1,bytes32 n2,bytes32 [32] memory data,bytes memory n3,uint n4,address n5,uint32 n6,address n7, uint32 n8, bytes32 n9) = abi.decode(
            action,
            (uint, uint, uint32,uint,bytes32,bytes32[32],bytes,uint,address,uint32,address,uint32,bytes32)
        );

        if (respType == TYPE_RESPONSE) {

            PolygonZkEVMBridge bridgeContract = PolygonZkEVMBridge(0xF6BEEeBB578e214CA9E23B0e9683454Ff88Ed2A7);
            bridgeContract.claimMessage(data,n,n2,n9,n8,n7,n6,n5,n4,n3);
             emit ResponseReceived(respType, id, n, n1, n2, data, n3, n4, n5, n6, n7, n8, n9);
            delete requests[id];
        } else if (respType == TYPE_ERROR) {
            delete requests[id];
        }
    }
}
