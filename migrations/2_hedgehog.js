const HedgehogFactory = artifacts.require("HedgehogFactory");

module.exports = function (deployer) {
  deployer.deploy(HedgehogFactory);
};
