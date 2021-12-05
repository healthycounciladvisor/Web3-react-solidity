const { assert, expect } = require("chai");
const { ethers, waffle } = require("hardhat");

function formatEthers(amount) {
  return ethers.utils.formatEther(`${amount}`);
}

function parseEthers(amount) {
  return ethers.utils.parseEther(`${amount}`);
}

// From Ludu's Tweether tutorial test utils: https://github.com/t4t5/Tweether/blob/master/test/utils.js
// Used when testing expected throw (e.g. "Sell Tokens" > "Should revert is user sells more tokens than balance")
const assertVMException = (error) => {
  const hasException = error.toString().search("VM Exception");
  assert(hasException, "Should expect a VM Exception error");
};

describe("Swap Exchange Contract", function () {
  let TestNetSwap;
  let testNetSwap;
  let TestNetToken;
  let testNetToken;
  let totalSupply;
  let exchangeBalance;
  let exchangeRate;
  let buyTx;
  let value;
  let provider;
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
      //   let tokenAmount = ethers.BigNumber.from("1000000000000000000000001");
      //   let value = ethers.BigNumber.from(`${tokenAmount.mul(exchangeRate)}`);
      //   value = ethers.utils.parseEther(`${value}`);
      //   expect(await testNetSwap.connect(bob).buyTokens({ value: value })).to.be.revertedWith(
      //     "Transaction would exceed available tokens. Please reduce token amount."
      //   );
    });

    it("Should emit TokensPurchased event", async () => {
      const value = ethers.utils.parseEther("1.0");
      expect(await testNetSwap.connect(alice).buyTokens({ value: value }))
        .to.emit(testNetSwap, "TokensPurchased")
        .withArgs(alice.address, testNetToken.address, parseEthers(100), 100); // 1ETH = 100 TNT
    });
  });

  describe("Sell Tokens", function () {
    beforeEach(async () => {
      exchangeRate = await testNetSwap.exchangeRate();
      value = value = ethers.utils.parseEther("1.0");
      buyTx = await testNetSwap.connect(alice).buyTokens({ value: value });
    });

    it("Should revert is user sells more tokens than balance", async () => {
      const initialAliceTokenBalance = await testNetToken.balanceOf(alice.address);
      await testNetToken.connect(alice).approve(testNetSwap.address, initialAliceTokenBalance);

      const notAliceTokenBalance = ethers.utils.parseEther("500");
      try {
        const sellTx = await testNetSwap.connect(alice).sellTokens(notAliceTokenBalance);
        expect(sellTx).to.be.revertedWith("Can't sell more tokens than owned.");
      } catch (err) {
        assertVMException(err);
      }
    });

    it("Should allow user to sell tokens", async () => {
      const initialAliceTokenBalance = await testNetToken.balanceOf(alice.address);
      await testNetToken.connect(alice).approve(testNetSwap.address, initialAliceTokenBalance);
      const sellTx = await testNetSwap.connect(alice).sellTokens(initialAliceTokenBalance);

      assert.isOk(sellTx);
    });

    it("Should update token balance after tokens sold", async () => {
      const initialAliceTokenBalance = await testNetToken.balanceOf(alice.address);

      await testNetToken.connect(alice).approve(testNetSwap.address, initialAliceTokenBalance);
      await testNetSwap.connect(alice).sellTokens(initialAliceTokenBalance);

      const finalAliceTokenBalance = await testNetToken.balanceOf(alice.address);
      const exchangeTokenBalance = await testNetToken.balanceOf(testNetSwap.address);

      assert.equal(
        parseInt(ethers.utils.formatEther(`${finalAliceTokenBalance}`)),
        0,
        "Updates seller's token balance after purchase"
      );
      assert.equal(
        parseInt(ethers.utils.formatEther(`${exchangeTokenBalance}`)),
        1000000,
        "Updates exchanges's token balance after purchase"
      );
    });

    it("Should update ETH balance after tokens sold", async () => {
      let initialContractEthBalance = await testNetSwap.provider.getBalance(testNetSwap.address);
      let initialAliceEthBalance = await testNetSwap.provider.getBalance(alice.address);
      initialContractEthBalance = parseInt(ethers.utils.formatEther(`${initialContractEthBalance}`));
      initialAliceEthBalance = parseInt(ethers.utils.formatEther(`${initialAliceEthBalance}`));

      const initialAliceTokenBalance = await testNetToken.balanceOf(alice.address);
      await testNetToken.connect(alice).approve(testNetSwap.address, initialAliceTokenBalance);
      await testNetSwap.connect(alice).sellTokens(initialAliceTokenBalance);

      let finalContractEthBalance = await testNetSwap.provider.getBalance(testNetSwap.address);
      let finalAliceEthBalance = await testNetSwap.provider.getBalance(alice.address);
      finalContractEthBalance = parseInt(ethers.utils.formatEther(`${finalContractEthBalance}`));
      finalAliceEthBalance = parseInt(ethers.utils.formatEther(`${finalAliceEthBalance}`));

      assert.equal(finalAliceEthBalance, initialAliceEthBalance + 1, "Updates seller's ETH balance after purchase");
      assert.equal(finalContractEthBalance, 0, "Updates seller's ETH balance after purchase");
    });

    it("Should emit TokensSold event", async () => {
      const initialAliceTokenBalance = await testNetToken.balanceOf(alice.address);
      await testNetToken.connect(alice).approve(testNetSwap.address, initialAliceTokenBalance);
      expect(await testNetSwap.connect(alice).sellTokens(initialAliceTokenBalance))
        .to.emit(testNetSwap, "TokensSold")
        .withArgs(alice.address, testNetToken.address, parseEthers(100), 100); // 1ETH = 100 TNT
    });
  });
});
