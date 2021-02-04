// SPDX-License-Identifier: GPL-3.0
pragma solidity =0.6.11;

import './Hedgehog.sol';

contract HedgehogFactory {

    mapping(address =>  address) public hedgehog;
    address[] public allHedgehogs;

    event Create(address hedgehog, address asset);
 
    function allHedgehogsLength() external view returns (uint) {
        return allHedgehogs.length;
    }

    function createHedgehog(address asset) public returns (address) {
        require(asset != address(0), "HedgehogFactory: zero asset");
        require(hedgehog[asset] == address(0), "HedgehogFactory: existing hedgehog");
        Hedgehog _hedgehog = new Hedgehog();
        _hedgehog.initialize(asset);
        hedgehog[asset] = address(_hedgehog);
        allHedgehogs.push(address(_hedgehog));
        Create(address(_hedgehog), asset);
        return address(_hedgehog);
    }
}
