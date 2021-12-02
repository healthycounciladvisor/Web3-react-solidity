const { assert, expect } = require("chai");
const { ethers } = require("hardhat");

describe("Token Contract", function () {
  let TokenContract;
  let tokenContract;
  let initialSupply;
  let owner;
  let alice;
  let bob;
  let charlie;

  beforeEach(async () => {
    TokenContract = await ethers.getContractFactory("Token");
    initialSupply = 1000000;
    tokenContract = await TokenContract.deploy(initialSupply);
    await tokenContract.deployed();
    [owner, alice, bob, charlie] = await ethers.getSigners();
  });

  describe("Deployment", function () {
    it("Should initialize contract with correct values", async () => {
      let tokenName = await tokenContract.name();
      let tokenSymbol = await tokenContract.symbol();

      tokenName = ethers.utils.parseBytes32String(tokenName);
      tokenSymbol = ethers.utils.parseBytes32String(tokenSymbol);

      assert.equal(tokenName, "TestNetToken", "Sets correct name for token");
      assert.equal(tokenSymbol, "TNT", "Sets correct symbol for token");
    });

    it("Should set total supply on deployment", async () => {
      const deployedSupply = await tokenContract.totalSupply();
      assert.equal(deployedSupply.toNumber(), initialSupply, `Sets the total supply to ${initialSupply}`);
    });

    it("Should allocate initial supply to owner", async () => {
      const ownerBalance = await tokenContract.balanceOf(owner.address);
      assert.equal(ownerBalance.toNumber(), initialSupply, "Allocates initial supply to owner");
    });
  });

  describe("Transfers", function () {
    it("Should revert if sender doesn't have enough tokens", async () => {
      const tx = tokenContract.transfer(alice.address, 1000001);
      await expect(tx).to.be.revertedWith("You don't have enough TNT tokens to complete this transaction.");
    });

    it("Should transfer tokens and update balances", async () => {
      await tokenContract.transfer(alice.address, 250);

      const ownerBalance = await tokenContract.balanceOf(owner.address);
      const aliceBalance = await tokenContract.balanceOf(alice.address);

      assert.equal(ownerBalance.toNumber(), 999750, "Sender balance updates after purchase.");
      assert.equal(aliceBalance.toNumber(), 250, "Receiver balance updates after purchase.");
    });

    it("Should emit Transfer event on transfer", async () => {
      const tx = tokenContract.transfer(alice.address, 250);
      await expect(tx).to.emit(tokenContract, "Transfer").withArgs(owner.address, alice.address, 250);
    });

    it("Should return 'true' when transfer successfully completes", async () => {
      // Using ether.js .callStatic to simulate function as if executed on-chain in order to get return value
      // https://ethereum.stackexchange.com/a/109992
      const tx = await tokenContract.callStatic.transfer(alice.address, 250);
      assert.equal(tx, true, "Returns true on success");
    });
  });

  describe("Allowance", function () {
    it("Should store allowance for delegated transfer", async () => {
      await tokenContract.approve(alice.address, 250);
      const tx = await tokenContract.callStatic.allowance(owner.address, alice.address);
      assert.equal(tx, 250, "Stores allowance for delegated transfer");
    });

    it("Should emit Approval event on approve", async () => {
      const tx = tokenContract.approve(alice.address, 250);
      await expect(tx).to.emit(tokenContract, "Approval").withArgs(owner.address, alice.address, 250);
    });

    it("Should return 'true' if tokens approved for delegated transfer", async () => {
      const tx = await tokenContract.callStatic.approve(alice.address, 250);
      assert.equal(tx, true, "Returns true on success");
    });
  });

  describe("Delegated Transfers", function () {
    beforeEach(async () => {
      await tokenContract.transfer(alice.address, 250);
      await tokenContract.connect(alice).approve(charlie.address, 200);
    });

    it("Should revert if delegate transfers more tokens than delegator's balance", async () => {
      const tx = tokenContract.connect(charlie).transferFrom(alice.address, bob.address, 300);
      await expect(tx).to.be.revertedWith(
        "Original account doesn't have enough TNT tokens to complete this transaction."
      );
    });

    it("Should revert if delegate transfers more tokens than allowed", async () => {
      const tx = tokenContract.connect(charlie).transferFrom(alice.address, bob.address, 250);
      await expect(tx).to.be.revertedWith("You haven't been allocated enough TNT tokens to complete this transaction.");
    });

    it("Should transfer delegated tokens and update balances", async () => {
      await tokenContract.connect(charlie).transferFrom(alice.address, bob.address, 100);

      const aliceBalance = await tokenContract.balanceOf(alice.address);
      const bobBalance = await tokenContract.balanceOf(bob.address);

      assert.equal(aliceBalance.toNumber(), 150, "Delegator balance updates after delegated transfer.");
      assert.equal(bobBalance.toNumber(), 100, "Receiver balance updates after delegated transfer.");
    });

    it("Should transfer delegated tokens and update allowance", async () => {
      await tokenContract.connect(charlie).transferFrom(alice.address, bob.address, 100);
      const tx = await tokenContract.callStatic.allowance(alice.address, charlie.address);
      assert.equal(tx, 100, "Updates allowance after delegated transfer");
    });

    it("Should emit Transfer event on delegated transfer", async () => {
      const tx = tokenContract.connect(charlie).transferFrom(alice.address, bob.address, 100);
      await expect(tx).to.emit(tokenContract, "Transfer").withArgs(alice.address, bob.address, 100);
    });

    it("Should return 'true' if tokens approved for delegated transfer", async () => {
      const tx = await tokenContract.connect(charlie).callStatic.transferFrom(alice.address, bob.address, 100);
      assert.equal(tx, true, "Returns true on success");
    });
  });
});
