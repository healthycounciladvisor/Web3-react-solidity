const { assert, expect } = require("chai");
const { ethers } = require("hardhat");

function formatEthers(amount) {
  return ethers.utils.formatEther(`${amount}`);
}

function parseEthers(amount) {
  return ethers.utils.parseEther(`${amount}`);
}

describe("TestNetToken Contract", function () {
  let TestNetToken;
  let testNetToken;
  let totalSupply;
  let owner;
  let alice;
  let bob;
  let charlie;

  beforeEach(async () => {
    TestNetToken = await ethers.getContractFactory("TestNetToken");
    testNetToken = await TestNetToken.deploy();
    await testNetToken.deployed();
    [owner, alice, bob, charlie] = await ethers.getSigners();
    totalSupply = await testNetToken.totalSupply();
    totalSupply = formatEthers(totalSupply);
  });

  describe("Deployment", function () {
    it("Should initialize contract with correct values", async () => {
      let tokenName = await testNetToken.name();
      let tokenSymbol = await testNetToken.symbol();

      tokenName = ethers.utils.parseBytes32String(tokenName);
      tokenSymbol = ethers.utils.parseBytes32String(tokenSymbol);

      assert.equal(tokenName, "TestNetToken", "Sets correct name for token");
      assert.equal(tokenSymbol, "TNT", "Sets correct symbol for token");
    });

    it("Should set total supply on deployment", async () => {
      const deployedSupply = await testNetToken.totalSupply();
      assert.equal(formatEthers(deployedSupply), totalSupply, "Sets the total supply");
    });

    it("Should allocate initial supply to owner", async () => {
      const ownerBalance = await testNetToken.balanceOf(owner.address);
      assert.equal(formatEthers(ownerBalance), totalSupply, "Allocates initial supply to owner");
    });
  });

  describe("Transfers", function () {
    it("Should revert if sender doesn't have enough tokens", async () => {
      const tx = testNetToken.transfer(alice.address, parseEthers(1000001));
      await expect(tx).to.be.revertedWith("You don't have enough tokens to complete this transaction.");
    });

    it("Should transfer tokens and update balances", async () => {
      const expectedBalance = parseEthers(999750);

      await testNetToken.transfer(alice.address, parseEthers(250));

      const ownerBalance = await testNetToken.balanceOf(owner.address);
      const aliceBalance = await testNetToken.balanceOf(alice.address);

      assert.equal(formatEthers(ownerBalance), formatEthers(expectedBalance), "Sender balance updates after purchase.");
      assert.equal(formatEthers(aliceBalance), "250.0", "Receiver balance updates after purchase.");
    });

    it("Should emit Transfer event on transfer", async () => {
      const tx = testNetToken.transfer(alice.address, 250);
      await expect(tx).to.emit(testNetToken, "Transfer").withArgs(owner.address, alice.address, 250);
    });

    it("Should return 'true' when transfer successfully completes", async () => {
      // Using ether.js .callStatic to simulate function as if executed on-chain in order to get return value
      // https://ethereum.stackexchange.com/a/109992
      const tx = await testNetToken.callStatic.transfer(alice.address, 250);
      assert.equal(tx, true, "Returns true on success");
    });
  });

  describe("Allowance", function () {
    it("Should store allowance for delegated transfer", async () => {
      await testNetToken.approve(alice.address, 250);
      const tx = await testNetToken.callStatic.allowance(owner.address, alice.address);
      assert.equal(tx, 250, "Stores allowance for delegated transfer");
    });

    it("Should emit Approval event on approve", async () => {
      const tx = testNetToken.approve(alice.address, 250);
      await expect(tx).to.emit(testNetToken, "Approval").withArgs(owner.address, alice.address, 250);
    });

    it("Should return 'true' if tokens approved for delegated transfer", async () => {
      const tx = await testNetToken.callStatic.approve(alice.address, 250);
      assert.equal(tx, true, "Returns true on success");
    });
  });

  describe("Delegated Transfers", function () {
    beforeEach(async () => {
      await testNetToken.transfer(alice.address, 250);
      await testNetToken.connect(alice).approve(charlie.address, 200);
    });

    it("Should revert if delegate transfers more tokens than delegator's balance", async () => {
      const tx = testNetToken.connect(charlie).transferFrom(alice.address, bob.address, 300);
      await expect(tx).to.be.revertedWith("Original account doesn't have enough tokens to complete this transaction.");
    });

    it("Should revert if delegate transfers more tokens than allowed", async () => {
      const tx = testNetToken.connect(charlie).transferFrom(alice.address, bob.address, 250);
      await expect(tx).to.be.revertedWith("You haven't been allocated enough tokens to complete this transaction.");
    });

    it("Should transfer delegated tokens and update balances", async () => {
      await testNetToken.connect(charlie).transferFrom(alice.address, bob.address, 100);

      const aliceBalance = await testNetToken.balanceOf(alice.address);
      const bobBalance = await testNetToken.balanceOf(bob.address);

      assert.equal(aliceBalance.toNumber(), 150, "Delegator balance updates after delegated transfer.");
      assert.equal(bobBalance.toNumber(), 100, "Receiver balance updates after delegated transfer.");
    });

    it("Should transfer delegated tokens and update allowance", async () => {
      await testNetToken.connect(charlie).transferFrom(alice.address, bob.address, 100);
      const tx = await testNetToken.callStatic.allowance(alice.address, charlie.address);
      assert.equal(tx, 100, "Updates allowance after delegated transfer");
    });

    it("Should emit Transfer event on delegated transfer", async () => {
      const tx = testNetToken.connect(charlie).transferFrom(alice.address, bob.address, 100);
      await expect(tx).to.emit(testNetToken, "Transfer").withArgs(alice.address, bob.address, 100);
    });

    it("Should return 'true' if tokens approved for delegated transfer", async () => {
      const tx = await testNetToken.connect(charlie).callStatic.transferFrom(alice.address, bob.address, 100);
      assert.equal(tx, true, "Returns true on success");
    });
  });
});
