pragma solidity  ^0.8.15;


contract Multisig {
    address [] public approvers;
    uint approvals_num;
    struct Transfer {
        uint _id;
        uint _amount;
        address payable _to;
        uint _approvals;
        bool _sent;
    }

    modifier Approver (){
        bool approved = false;
        for (uint i=0; i<approvers.length; i++) {
            if (approvers[i]==msg.sender){
                approved =true;
            }
        }
        require(approved==true, "The sender address is not included in the approvers array" );
        _;

    }
    mapping (uint =>Transfer) transfers;
    uint nextId;
    mapping (address=>mapping(uint=>bool))  public approvals;
    constructor (address[] memory _approvers, uint _approvals_num) payable {
        approvers=_approvers;
        approvals_num=_approvals_num;

    }

    function createTransfer (uint amount, address payable to) external  Approver {
        transfers[nextId]=Transfer (
            nextId,
            amount,
            to,
            0,
            false
        );
        nextId++;

        
    }

    function sendTransfer (uint id) external  Approver {
        require (transfers[id]._sent == false, "The transaction has been sent already");
        if (transfers[id]._approvals >=approvals_num) {
            transfers[id]._sent = true;
            address payable to = transfers[id]._to;
            uint amount = transfers[id]._amount;
            to.transfer(amount);
            

  

            return;

        }
        if (approvals[msg.sender][id]==false) {
            approvals[msg.sender][id]=true;
            transfers[id]._approvals ++;

            


        }
    }
}