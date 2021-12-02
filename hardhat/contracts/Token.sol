//SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

contract Token {
    bytes32 public name = "TestNetToken";
    bytes32 public symbol = "TNT";
    uint256 public totalSupply;

    /* token owner => amount of owned tokens */
    mapping(address => uint256) public balanceOf;
    /* delegator => (delegate => amount of allocated tokens) */
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

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

        return true; // TODO: handle false return value
    }

    function approve(address _spender, uint256 _value)
        public
        returns (bool success)
    {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true; // TODO: handle false return value
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public returns (bool success) {
        require(
            _value <= balanceOf[_from],
            "Original account doesn't have enough TNT tokens to complete this transaction."
        );
        require(
            _value <= allowance[_from][msg.sender],
            "You haven't been allocated enough TNT tokens to complete this transaction."
        );
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;

        allowance[_from][msg.sender] -= _value;

        emit Transfer(_from, _to, _value);

        return true; // TODO: handle false return value
    }
}
