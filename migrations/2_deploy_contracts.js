var CarTracking = artifacts.require("./CarTracking.sol");

module.exports = function(deployer) {
  deployer.deploy(CarTracking);
};
