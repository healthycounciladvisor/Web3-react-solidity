const { assert, expect } = require("chai");
const { ethers } = require("hardhat");

// From Ludu's Tweether tutorial test utils: https://github.com/t4t5/Tweether/blob/master/test/utils.js
// Used when testing expected throw
const assertVMException = (error) => {
  const hasException = error.toString().search("VM Exception");
  assert(hasException, "Should expect a VM Exception error");
};

describe("TokenSwap Contract", function () {
  let TokenSwapContract;
  let tokenSwapContract;
  let TokenContract;
  let tokenContract;
  let tokenPrice;
  let initialSupply;
  let tokenSwapSupply;
  let owner;
  let alice;
  let bob;
  let charlie;

  beforeEach(async () => {
    TokenContract = await ethers.getContractFactory("Token");
    initialSupply = 1000000;
    tokenContract = await TokenContract.deploy(initialSupply);
    await tokenContract.deployed();

    TokenSwapContract = await ethers.getContractFactory("TokenSwap");
    const tokenPrice = ethers.utils.parseEther("0.01");
    tokenSwapContract = await TokenSwapContract.deploy(tokenContract.address, tokenPrice);
    await tokenSwapContract.deployed();

    [owner, alice, bob, charlie] = await ethers.getSigners();

    // Provide TokenSwap with 75% of initialSupply
    tokenSwapSupply = 750000;
    tokenContract.connect(owner).transfer(tokenSwapContract.address, tokenSwapSupply);
  });

  describe("Deployment", function () {
    it("Should initialize contract with correct values", async () => {
      let tokenSwapName = await tokenSwapContract.name();
      tokenSwapName = ethers.utils.parseBytes32String(tokenSwapName);
      assert.equal(tokenSwapName, "TokenSwap Instant Exchange", "Sets correct name for exchange");
    });

    it("Should be able to access token contract", async () => {
      const tokenInstance = await tokenSwapContract.token();
      assert.equal(tokenInstance, tokenContract.address, "Can access token contract");
    });

    it("Should return correct price for token", async () => {
      let tokenPrice = await tokenSwapContract.tokenPrice();
      tokenPrice = ethers.utils.formatEther(tokenPrice);
      assert.equal(tokenPrice, 0.01, "Returns correct price");
    });
  });

  describe("Transactions", function () {
    beforeEach(async () => {
      tokenPrice = await tokenSwapContract.tokenPrice();
      tokenPrice = ethers.utils.formatEther(tokenPrice);
    });

    it("Should revert if transaction would exceed TokenSwap contract's total supply", async () => {
      const tokenAmount = tokenSwapSupply + 1;
      let value = tokenAmount * tokenPrice;
      value = ethers.utils.parseEther(`${value}`);
      const tx = tokenSwapContract.connect(bob).buyTokens(tokenAmount, { value: value });
      await expect(tx).to.be.revertedWith("Transaction would exceed available tokens. Please reduce token amount.");
    });

    it("Should revert if not enough funds sent for transaction", async () => {
      const tokenAmount = 2;
      let value = tokenPrice;
      value = ethers.utils.parseEther(`${value}`);
      const tx = tokenSwapContract.connect(alice).buyTokens(tokenAmount, { value: value });
      await expect(tx).to.be.revertedWith("Not enough funds sent to complete this transaction.");
    });

    it("Should transfer purchased tokens and update balances", async () => {
      const tokenAmount = 1;
      let value = tokenAmount * tokenPrice;
      value = ethers.utils.parseEther(`${value}`);
      await tokenSwapContract.connect(alice).buyTokens(tokenAmount, { value: value });

      const aliceBalance = await tokenContract.balanceOf(alice.address);
      const tokenSwapBalance = await tokenContract.balanceOf(tokenSwapContract.address);

      assert.equal(tokenSwapBalance.toNumber(), 749999, "TokenSwap balance updates after purchase.");
      assert.equal(aliceBalance.toNumber(), 1, "Buyer balance updates after purchase.");
    });

    it("Should update number of tokens sold", async () => {
      const tokenAmount = 1;
      let value = tokenAmount * tokenPrice;
      value = ethers.utils.parseEther(`${value}`);
      await tokenSwapContract.connect(alice).buyTokens(tokenAmount, { value: value });

      const tokensSold = await tokenSwapContract.tokensSold();

      assert.equal(tokensSold.toNumber(), tokenAmount, "Returns correct number of tokens sold");
    });

    it("Should emit Sell event when tokens purchased", async () => {
      const tokenAmount = 1;
      let value = tokenAmount * tokenPrice;
      value = ethers.utils.parseEther(`${value}`);
      const tx = tokenSwapContract.connect(alice).buyTokens(tokenAmount, { value: value });
      await expect(tx).to.emit(tokenSwapContract, "Sell").withArgs(alice.address, 1);
    });
  });

  describe("Token Sale End", function () {
    it("Should revert if end token sale attempted by entity other than owner", async () => {
      const tx = tokenSwapContract.connect(charlie).endSale();
      await expect(tx).to.be.revertedWith("Only contract owner can complete this action.");
    });

    it("Should allower owner to end token sale", async () => {
      const tx = tokenSwapContract.endSale();
      assert.isOk(tx);
    });

    it("Should transfer unsold tokens to contract owner", async () => {
      const tokenSwapBalance = await tokenContract.balanceOf(tokenSwapContract.address);
      const initialOwnerBalance = await tokenContract.balanceOf(owner.address);
      const totalBalance = initialOwnerBalance.toNumber() + tokenSwapBalance.toNumber();

      await tokenSwapContract.endSale();

      const ownerBalance = await tokenContract.balanceOf(owner.address);

      assert.equal(ownerBalance.toNumber(), totalBalance, "TokenSwap remaining balance transfered to owner.");
    });

    it("Should self destruct when endSale called", async () => {
      try {
        await tokenSwapContract.endSale();
        const tokenAddress = await tokenSwapContract.token();
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
