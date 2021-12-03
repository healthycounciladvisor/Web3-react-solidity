const { assert, expect } = require("chai");
const { ethers } = require("hardhat");

// From Ludu's Tweether tutorial test utils: https://github.com/t4t5/Tweether/blob/master/test/utils.js
// Used when testing expected throw (e.g. "Token Sale End" > "Should self destruct when endSale called")
const assertVMException = (error) => {
  const hasException = error.toString().search("VM Exception");
  assert(hasException, "Should expect a VM Exception error");
};

describe("CrowdSale Contract", function () {
  let TestNetCrowdSale;
  let testNetCrowdSale;
  let TestNetToken;
  let testNetToken;
  let tokenPrice;
  let initialSupply;
  let crowdSaleSupply;
  let owner;
  let alice;
  let bob;
  let charlie;

  beforeEach(async () => {
    TestNetToken = await ethers.getContractFactory("TestNetToken");
    initialSupply = 1000000;
    testNetToken = await TestNetToken.deploy(initialSupply);
    await testNetToken.deployed();

    TestNetCrowdSale = await ethers.getContractFactory("TestNetCrowdSale");
    const tokenPrice = ethers.utils.parseEther("0.01");
    testNetCrowdSale = await TestNetCrowdSale.deploy(testNetToken.address, tokenPrice);
    await testNetCrowdSale.deployed();

    [owner, alice, bob, charlie] = await ethers.getSigners();

    // Provide CrowdSale with 75% of initialSupply
    crowdSaleSupply = 750000;
    testNetToken.connect(owner).transfer(testNetCrowdSale.address, crowdSaleSupply);
  });

  describe("Deployment", function () {
    it("Should initialize contract with correct values", async () => {
      let crowdSaleName = await testNetCrowdSale.name();
      crowdSaleName = ethers.utils.parseBytes32String(crowdSaleName);
      assert.equal(crowdSaleName, "TestNetToken Crowd Sale", "Sets correct name for exchange");
    });

    it("Should be able to access token contract", async () => {
      const testNetTokenInstance = await testNetCrowdSale.testNetToken();
      assert.equal(testNetTokenInstance, testNetToken.address, "Token contract initialized with correct address");
    });

    it("Should return correct price for token", async () => {
      let tokenPrice = await testNetCrowdSale.tokenPrice();
      tokenPrice = ethers.utils.formatEther(tokenPrice);
      assert.equal(tokenPrice, 0.01, "Returns correct price");
    });
  });

  describe("Transactions", function () {
    beforeEach(async () => {
      tokenPrice = await testNetCrowdSale.tokenPrice();
      tokenPrice = ethers.utils.formatEther(tokenPrice);
    });

    it("Should revert if transaction would exceed CrowdSale contract's total supply", async () => {
      const tokenAmount = crowdSaleSupply + 1;
      let value = tokenAmount * tokenPrice;
      value = ethers.utils.parseEther(`${value}`);
      const tx = testNetCrowdSale.connect(bob).buyTokens(tokenAmount, { value: value });
      await expect(tx).to.be.revertedWith("Transaction would exceed available tokens. Please reduce token amount.");
    });

    it("Should revert if not enough funds sent for transaction", async () => {
      const tokenAmount = 2;
      let value = tokenPrice;
      value = ethers.utils.parseEther(`${value}`);
      const tx = testNetCrowdSale.connect(alice).buyTokens(tokenAmount, { value: value });
      await expect(tx).to.be.revertedWith("Not enough funds sent to complete this transaction.");
    });

    it("Should transfer purchased tokens and update balances", async () => {
      const tokenAmount = 1;
      let value = tokenAmount * tokenPrice;
      value = ethers.utils.parseEther(`${value}`);
      await testNetCrowdSale.connect(alice).buyTokens(tokenAmount, { value: value });

      const aliceBalance = await testNetToken.balanceOf(alice.address);
      const crowdSaleBalance = await testNetToken.balanceOf(testNetCrowdSale.address);

      assert.equal(crowdSaleBalance.toNumber(), 749999, "CrowdSale balance updates after purchase.");
      assert.equal(aliceBalance.toNumber(), 1, "Buyer balance updates after purchase.");
    });

    it("Should update number of tokens sold", async () => {
      const tokenAmount = 1;
      let value = tokenAmount * tokenPrice;
      value = ethers.utils.parseEther(`${value}`);
      await testNetCrowdSale.connect(alice).buyTokens(tokenAmount, { value: value });

      const tokensSold = await testNetCrowdSale.tokensSold();

      assert.equal(tokensSold.toNumber(), tokenAmount, "Returns correct number of tokens sold");
    });

    it("Should emit Sell event when tokens purchased", async () => {
      const tokenAmount = 1;
      let value = tokenAmount * tokenPrice;
      value = ethers.utils.parseEther(`${value}`);
      const tx = testNetCrowdSale.connect(alice).buyTokens(tokenAmount, { value: value });
      await expect(tx).to.emit(testNetCrowdSale, "Sell").withArgs(alice.address, 1);
    });
  });

  describe("Token Sale End", function () {
    it("Should revert if end token sale attempted by entity other than owner", async () => {
      const tx = testNetCrowdSale.connect(charlie).endSale();
      await expect(tx).to.be.revertedWith("Only contract owner can complete this action.");
    });

    it("Should allower owner to end token sale", async () => {
      const tx = testNetCrowdSale.endSale();
      assert.isOk(tx);
    });

    it("Should transfer unsold tokens to contract owner", async () => {
      const crowdSaleBalance = await testNetToken.balanceOf(testNetCrowdSale.address);
      const initialOwnerBalance = await testNetToken.balanceOf(owner.address);
      const totalBalance = initialOwnerBalance.toNumber() + crowdSaleBalance.toNumber();

      await testNetCrowdSale.endSale();

      const ownerBalance = await testNetToken.balanceOf(owner.address);

      assert.equal(ownerBalance.toNumber(), totalBalance, "CrowdSale remaining balance transfered to owner.");
    });

    it("Should self destruct when endSale called", async () => {
      try {
        await testNetCrowdSale.endSale();
        const tokenAddress = await testNetCrowdSale.token();
        assert.equal(
          tokenAddress,
          ethers.constants.AddressZero,
          "Token address is reset to 0x0 upon self-destruction."
        );
      } catch (err) {
        assertVMException(err);
        console.log(err);
      }
    });
  });
});
