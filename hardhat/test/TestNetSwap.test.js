const { assert, expect } = require("chai");
const { ethers } = require("hardhat");

function formatEthers(amount) {
  return ethers.utils.formatEther(`${amount}`);
}

function parseEthers(amount) {
  return ethers.utils.parseEther(`${amount}`);
}

describe("Swap Exchange Contract", function () {
  let TestNetSwap;
  let testNetSwap;
  let TestNetToken;
  let testNetToken;
  let totalSupply;
  let exchangeBalance;
  let exchangeRate;
  let owner;
  let alice;
  let bob;
  let charlie;

  beforeEach(async () => {
    TestNetToken = await ethers.getContractFactory("TestNetToken");
    testNetToken = await TestNetToken.deploy();
    await testNetToken.deployed();

    TestNetSwap = await ethers.getContractFactory("TestNetSwap");
    testNetSwap = await TestNetSwap.deploy(testNetToken.address);
    await testNetSwap.deployed();

    [owner, alice, bob, charlie] = await ethers.getSigners();

    totalSupply = await testNetToken.totalSupply();
    testNetToken.connect(owner).transfer(testNetSwap.address, totalSupply);
  });

  describe("Deployment", function () {
    it("Should initialize contract with correct values", async () => {
      let exchangeName = await testNetSwap.name();
      exchangeName = ethers.utils.parseBytes32String(exchangeName);
      assert.equal(exchangeName, "TestNetToken Swap Exchange", "Sets correct name for exchange");
    });

    it("Should be able to access token contract", async () => {
      const testNetTokenInstance = await testNetSwap.testNetToken();
      assert.equal(testNetTokenInstance, testNetToken.address, "Token contract initialized with correct address");
    });

    it("Should have initial supply as balance", async () => {
      const deployedSupply = await testNetToken.totalSupply();
      const exchangeSupply = await testNetToken.balanceOf(testNetSwap.address);
      assert.equal(formatEthers(exchangeSupply), formatEthers(deployedSupply), "Returns correct starting balance");
    });

    it("Should return correct exchange rate", async () => {
      const exchangeRate = await testNetSwap.exchangeRate();
      assert.equal(exchangeRate, 100, "Returns correct rate");
    });
  });

  describe("Buy Tokens", function () {
    beforeEach(async () => {
      exchangeBalance = await testNetToken.balanceOf(testNetSwap.address);
      exchangeRate = await testNetSwap.exchangeRate();
    });

    it("Should transfer purchased tokens and update balances", async () => {
      const value = ethers.utils.parseEther("1.0");
      await testNetSwap.connect(alice).buyTokens({ value: value });

      const aliceBalance = await testNetToken.balanceOf(alice.address);
      const exchangeBalance = await testNetToken.balanceOf(testNetSwap.address);

      assert.equal(formatEthers(aliceBalance), "100.0", "Updates buyer's token balance after purchase");
      assert.equal(formatEthers(exchangeBalance), "999900.0", "Updates exchange's token balance after purchase");
    });

    it("Should revert if transaction would exceed exchange contract's total supply", async () => {
      // Hardhat test accounts have max 10000 ETH
      // TODO: Find out how to modify default account balance or find out how to test without modifying default accounts
      //   let tokenAmount = ethers.BigNumber.from("1000000000000000000000001");
      //   let value = ethers.BigNumber.from(`${tokenAmount.mul(exchangeRate)}`);
      //   value = ethers.utils.parseEther(`${value}`);
      //   expect(await testNetSwap.connect(bob).buyTokens({ value: value })).to.be.revertedWith(
      //     "Transaction would exceed available tokens. Please reduce token amount."
      //   );
    });

    it("Should emit TokenPurchased event", async () => {
      const value = ethers.utils.parseEther("1.0");
      expect(await testNetSwap.connect(alice).buyTokens({ value: value }))
        .to.emit(testNetSwap, "TokenPurchased")
        .withArgs(alice.address, testNetToken.address, parseEthers(100), 100); // 1ETH = 100 TNT
    });
  });

  describe("Sell Tokens", function () {
    beforeEach(async () => {
      exchangeBalance = await testNetToken.balanceOf(testNetSwap.address);
      exchangeRate = await testNetSwap.exchangeRate();
      provider = waffle.provider;
    });

    it("Should transfer purchased tokens and update token, ETH balances", async () => {});
  });
});
