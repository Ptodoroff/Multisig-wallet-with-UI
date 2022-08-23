
import Multisig from "./build/contracts/Multisig.json";
import React,{ useEffect, useState} from "react";
import {getWeb3} from './utils.js';

function App() {
  const [web3,setWeb3]=useState(undefined);
  const [contract,setContract]=useState(undefined);
  const [accounts,setAccounts]=useState(undefined);
  const [balance,setBalance]= useState(undefined);
  const [approvers, setApprovers]=useState(undefined);

  useEffect(()=>{
    let init = async  () =>{
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId()
      const deployedNetwork = Multisig.networks[networkId];
      const contract = new web3.eth.Contract(Multisig.abi, deployedNetwork.address);
      contract.options.address = "0x4a0De5521374939e11010a58e4901E237Dc32f59";
      setWeb3(web3);
      setContract(contract);
      setAccounts(accounts);
      

    }

    window.ethereum.on("accountsChanged",accounts=>{
      setAccounts(accounts);
    })

    init();
  },[]);

  useEffect (()=>{
    if(typeof web3 !=='undefined' && typeof contract!=='undefined'){
      showBalance();
      showApprovers();
    }

  },[web3,contract,accounts])

  async function showBalance (){
    const balance = await web3.eth.getBalance(contract.options.address);
    setBalance(balance);
  }

  async function showApprovers () {
    const approvers = await contract.methods.approvers(0).call()
    setApprovers(approvers);
  }
 
  



  return (
<div className = "container">
  <div text-align="center">
  <h1 className="text-center">Multisig</h1>
  </div>
  <div className="row">
  <p className="balance col-sm-12"> Balance:{balance}   </p>
  <p className="approvers col-sm-12">Approvers: {approvers}   </p>
  <p className="approvers col-sm-12">Minimum approvers needed:    </p>
  </div>

  <div>
    <form className="form-control">
    <label htmlFor="createTransfer"> Create Transfer</label>
    <label htmlFor="amount" className="col-sm-12"> Amount</label>
     <input type="number" id="amount"/>
     <label htmlFor="to" className="col-sm-12">Recipient</label>
     <input type="text" id="to" placeholder = "0x ..."/>
     <p></p>
    <button type="submit" className="btn btn-danger">Create transfer</button>
    </form>
  </div>
  <br/>

  <div>
    <form className="form-control">
    <label htmlFor="csendTransfer"> Send Transfer</label>
    <label htmlFor="amount" className="col-sm-12"> Transcation Id</label>
     <input type="number" id="amount"/>
     <p></p>
    <button type="submit" className="btn btn-success">Approve transfer</button>
    <p className="approvals-remaining">Remaining approvals for this transfer:</p>
    </form>
  </div>





</div>
  );
}

export default App;
