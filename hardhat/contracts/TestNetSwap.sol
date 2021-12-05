//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./TestNetToken.sol";

contract TestNetSwap {
    bytes32 public name = "TestNetToken Swap Exchange";
    uint256 public exchangeRate = 100;
    address payable owner;
    TestNetToken public testNetToken;

    event TokensPurchased(
        address buyer,
        address token,
        uint256 tokenAmount,
        uint256 exchangeRate
    );

    event TokensSold(
        address buyer,
        address token,
        uint256 tokenAmount,
        uint256 exchangeRate
    );

    constructor(TestNetToken _testNetToken) {
        owner = payable(msg.sender);
        testNetToken = _testNetToken;
    }

    function multiply(uint256 x, uint256 y) internal pure returns (uint256 z) {
        require(y == 0 || (z = x * y) / y == x, "ds-math-mul-overflow");
    }

    function buyTokens() public payable {
        uint256 tokenAmount = multiply(msg.value, exchangeRate);
        require(
            testNetToken.balanceOf(address(this)) >= tokenAmount,
            "Transaction would exceed available tokens. Please reduce token amount."
        );

        testNetToken.transfer(msg.sender, tokenAmount);
        // testNetToken.setApprovalForAll(address(this), true);

        emit TokensPurchased(
            msg.sender,
            address(testNetToken),
            tokenAmount,
            exchangeRate
        );
    }

    function sellTokens(uint256 _tokenAmount) public {
        require(
            testNetToken.balanceOf(msg.sender) >= _tokenAmount,
            "Can't sell more tokens than owned."
        );

        uint256 ethAmount = _tokenAmount / exchangeRate;
        require(
            address(this).balance >= ethAmount,
            "Not enought ETH balance in contract."
        );
        testNetToken.transferFrom(msg.sender, address(this), _tokenAmount);
        payable(msg.sender).transfer(ethAmount);

        emit TokensSold(
            msg.sender,
            address(testNetToken),
            _tokenAmount,
            exchangeRate
        );
    }
}
