//SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract Token {
    bytes32 public name = "TestNetToken";
    bytes32 public symbol = "TNT";
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;

    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    constructor(uint256 _initialSupply) {
        balanceOf[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;
    }

    function transfer(address _to, uint256 _value)
        public
        returns (bool success)
    {
        require(
            balanceOf[msg.sender] >= _value,
            "You don't have enough TNT tokens to complete this transaction."
        );
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;

        emit Transfer(msg.sender, _to, _value);

        return true;
    }
}
