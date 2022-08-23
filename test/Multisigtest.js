const { assert } = require("console");
const {expectRevert} = require("@openzeppelin/test-helpers");
const { web3 } = require("@openzeppelin/test-helpers/src/setup");

const Multisig = artifacts.require("Multisig");
let multisig;

contract ("Multisig", (accounts)=>{
    beforeEach (async ()=>{
        multisig = await Multisig.deployed();
    });

    it ("Creates a transfer", async () =>{
         await multisig.createTransfer(9999999999,accounts[3],{from:accounts[1]});
        let transfer = await multisig.transfers(0);
        assert (transfer._id.toNumber()==0, "The transaction struct is created");
        assert(transfer._amount.toNumber()==9999999999, "amounts match")
    })

    it (" Should not allow execution if msg.sender is not an approver", async () =>{
         await expectRevert(multisig.createTransfer(9999999999,
            accounts[3]
            ,{from:accounts[5]}),"The sender address is not included in the approvers array");
         })

         it (" Should not allow execution if approvals are less then required", async () =>{
            let balanceBefore = await web3.eth.getBalance(accounts[4]);
            await multisig.createTransfer(9999999999,
                accounts[4]
                ,{from:accounts[1]})
            await multisig.sendTransfer(0,{from:accounts[1]});

            let balanceAfter = await web3.eth.getBalance(accounts[4]);

            assert(balanceBefore==balanceAfter, "the sendTransfer function did not execute");

            })

            it (" Shold send the transfer if the required number of approvals is met", async () =>{
                await multisig.createTransfer(9999999999,
                    accounts[4]
                    ,{from:accounts[1]})
                await multisig.sendTransfer(0,{from:accounts[1]});
                await multisig.sendTransfer(0,{from:accounts[0]})
    
                let balanceAfter = await web3.eth.getBalance(accounts[4]);
    
                assert(balanceAfter==balanceAfter+9999999999, "the sendTransfer function did not execute");
    
                })
})