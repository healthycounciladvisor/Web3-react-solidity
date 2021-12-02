//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./Token.sol";

contract TokenSwap {
    bytes32 public name = "TokenSwap Instant Exchange";
    uint256 public tokenPrice;
    uint256 public tokensSold;
    address payable owner;

    Token public token;

    event Sell(address _buyer, uint256 _numberTokensPurchased);

    constructor(Token _token, uint256 _tokenPrice) {
        owner = payable(msg.sender);
        token = _token;
        tokenPrice = _tokenPrice;
    }

    // Using DappHub's DS-Math: https://github.com/dapphub/ds-math/blob/master/src/math.sol
    // TODO: explore options for safe arithmetic operations (e.g. OpenZeppelin's SafeMath)
    function multiply(uint256 x, uint256 y) internal pure returns (uint256 z) {
        require(y == 0 || (z = x * y) / y == x, "ds-math-mul-overflow");
    }

    function buyTokens(uint256 _tokenAmount) public payable {
        uint256 tokenSwapSupply = token.balanceOf(address(this));
        require(
            tokenSwapSupply >= _tokenAmount,
            "Transaction would exceed available tokens. Please reduce token amount."
        );
        uint256 total = multiply(_tokenAmount, tokenPrice);
        require(
            msg.value >= total,
            "Not enough funds sent to complete this transaction."
        );

        require(token.transfer(msg.sender, _tokenAmount)); // token.transfer currently doesn't handle false value

        tokensSold += _tokenAmount;
        emit Sell(msg.sender, _tokenAmount);
    }

    function endSale() public {
        require(
            msg.sender == owner,
            "Only contract owner can complete this action."
        );
        require(token.transfer(owner, token.balanceOf(address(this)))); // token.transfer currently doesn't handle false value

        selfdestruct(payable(owner));
    }
}
