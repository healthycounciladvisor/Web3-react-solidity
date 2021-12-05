//SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

contract TestNetToken {
    bytes32 public name = "TestNetToken";
    bytes32 public symbol = "TNT";
    uint256 public totalSupply = 1000000000000000000000000; // 1M
    uint8 public constant decimals = 18;

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

    constructor() {
        balanceOf[msg.sender] = totalSupply;
    }

    function transfer(address _to, uint256 _value)
        public
        returns (bool success)
    {
        require(
            balanceOf[msg.sender] >= _value,
            "You don't have enough tokens to complete this transaction."
        );

        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;

        emit Transfer(msg.sender, _to, _value);

        return true;
    }

    function approve(address _spender, uint256 _value)
        public
        returns (bool success)
    {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public returns (bool success) {
        require(
            _value <= balanceOf[_from],
            "Original account doesn't have enough tokens to complete this transaction."
        );
        require(
            _value <= allowance[_from][msg.sender],
            "You haven't been allocated enough tokens to complete this transaction."
        );

        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        allowance[_from][msg.sender] -= _value;

        emit Transfer(_from, _to, _value);

        return true;
    }
}
