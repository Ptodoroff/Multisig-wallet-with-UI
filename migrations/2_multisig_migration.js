const Multisig = artifacts.require("Multisig");

module.exports = function(deployer, _network, accounts) {
  deployer.deploy(
    Multisig, 
    [accounts[0], accounts[1], accounts[2]], 
    2,
    {value: 1000}
  );
};