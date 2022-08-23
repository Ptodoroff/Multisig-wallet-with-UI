pragma solidity  ^0.8.15;


contract Multisig {
    address [] public approvers;                                                    //list of addresses , allowed to approve
    uint public approvalsNum;                                                             //required approves
    struct Transfer {                                                               // a transaction struct
        uint _id;
        uint _amount;
        address payable _to;
        uint _approvals;
        bool _sent;
    }

    modifier Approver (){                                                          //an approver modifier that loops through the approvers array and  checks if the msg.sender is included
        bool approved = false;
        for (uint i=0; i<approvers.length; i++) {
            if (approvers[i]==msg.sender){
                approved =true;
            }
        }
        require(approved==true, "The sender address is not included in the approvers array" );
        _;

    }
    mapping (uint =>Transfer) public transfers;                                        // a mapping that stores every transfer struct. Public visibility so that mocha can access it for testing
    uint nextId;
    mapping (address=>mapping(uint=>bool))  public approvals;                   // a mapping that stores if a certain transfer is approved by an address
    constructor (address[] memory _approvers, uint _approvals_num) payable {
        approvers=_approvers;
        approvalsNum=_approvals_num;

    }

    function createTransfer (uint amount, address payable to) external  Approver {     //instantiates the transaction struct
        transfers[nextId]=Transfer (
            nextId,
            amount,
            to,
            0,
            false
        );
        nextId++;

        
    }

    function sendTransfer (uint id) external  Approver {                            //sends the transaction (input is the index of the transfer mapping)
        require (transfers[id]._sent == false, "The transaction has been sent already");
        if (transfers[id]._approvals >=approvalsNum) {
            transfers[id]._sent = true;
            address payable to = transfers[id]._to;
            uint amount = transfers[id]._amount;
            to.transfer(amount);
            

  

            return;

        }
        if (approvals[msg.sender][id]==false) {                                     //if the transfer does not have the required number of approvals, the approvals increment by one.
            approvals[msg.sender][id]=true;
            transfers[id]._approvals ++;

            


        }

    
    }

    fallback () external payable {}
}