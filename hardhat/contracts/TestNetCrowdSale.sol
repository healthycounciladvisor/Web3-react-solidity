//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./TestNetToken.sol";

contract TestNetCrowdSale {
    bytes32 public name = "TestNetToken Crowd Sale";
    uint256 public tokenPrice;
    uint256 public tokensSold;
    address payable owner;

    TestNetToken public testNetToken;

    event Sell(address _buyer, uint256 _numberTokensPurchased);

    constructor(TestNetToken _testNetToken, uint256 _tokenPrice) {
        owner = payable(msg.sender);
        testNetToken = _testNetToken;
        tokenPrice = _tokenPrice;
    }

    // Using DappHub's DS-Math: https://github.com/dapphub/ds-math/blob/master/src/math.sol
    function multiply(uint256 x, uint256 y) internal pure returns (uint256 z) {
        require(y == 0 || (z = x * y) / y == x, "ds-math-mul-overflow");
    }

    function buyTokens(uint256 _tokenAmount) public payable {
        uint256 crowdSaleSupply = testNetToken.balanceOf(address(this));
        require(
            crowdSaleSupply >= _tokenAmount,
            "Transaction would exceed available tokens. Please reduce token amount."
        );
        uint256 total = multiply(_tokenAmount, tokenPrice);
        require(
            msg.value >= total,
            "Not enough funds sent to complete this transaction."
        );

        require(testNetToken.transfer(msg.sender, _tokenAmount));

        tokensSold += _tokenAmount;
        emit Sell(msg.sender, _tokenAmount);
    }

    function endSale() public {
        require(
            msg.sender == owner,
            "Only contract owner can complete this action."
        );
        require(
            testNetToken.transfer(owner, testNetToken.balanceOf(address(this)))
        );

        selfdestruct(payable(owner));
    }
}
