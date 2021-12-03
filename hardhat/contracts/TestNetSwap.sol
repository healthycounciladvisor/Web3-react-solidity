//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./TestNetToken.sol";

contract TestNetSwap {
    bytes32 public name = "TestNetToken Swap Exchange";
    uint256 public exchangeRate = 100;
    address payable owner;
    TestNetToken public testNetToken;

    event TokenPurchased(
        address buyer,
        address token,
        uint256 tokenAmount,
        uint256 exchangeRate
    );

    constructor(TestNetToken _testNetToken) {
        owner = payable(msg.sender);
        testNetToken = _testNetToken;
    }

    // Using DappHub's DS-Math: https://github.com/dapphub/ds-math/blob/master/src/math.sol
    // TODO: explore options for safe arithmetic operations (e.g. OpenZeppelin's SafeMath)
    function add(uint256 x, uint256 y) internal pure returns (uint256 z) {
        require((z = x + y) >= x, "ds-math-add-overflow");
    }

    function multiply(uint256 x, uint256 y) internal pure returns (uint256 z) {
        require(y == 0 || (z = x * y) / y == x, "ds-math-mul-overflow");
    }

    uint256 constant WAD = 10**18;

    //rounds to zero if x*y < WAD / 2
    function wdiv(uint256 x, uint256 y) internal pure returns (uint256 z) {
        z = add(multiply(x, WAD), y / 2) / y;
    }

    function buyTokens() public payable {
        uint256 tokenAmount = multiply(msg.value, exchangeRate);
        require(
            testNetToken.balanceOf(address(this)) >= tokenAmount,
            "Transaction would exceed available tokens. Please reduce token amount."
        );

        testNetToken.transfer(msg.sender, tokenAmount);

        emit TokenPurchased(
            msg.sender,
            address(testNetToken),
            tokenAmount,
            exchangeRate
        );
    }

    function sellTokens(uint256 _tokenAmount) public payable {
        uint256 ethAmount = wdiv(_tokenAmount, exchangeRate);
        testNetToken.transferFrom(msg.sender, address(this), _tokenAmount);
        payable(msg.sender).transfer(ethAmount);
    }
}
