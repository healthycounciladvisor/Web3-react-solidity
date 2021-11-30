const { assert, expect } = require("chai");
const { ethers } = require("hardhat");
const { Contract } = require("hardhat/internal/hardhat-network/stack-traces/model");

describe("Token Contract", function () {
  let TokenContract;
  let tokenContract;
  let initialSupply;
  let owner;
  let alice;

  beforeEach(async () => {
    TokenContract = await ethers.getContractFactory("Token");
    initialSupply = 1000000;
    tokenContract = await TokenContract.deploy(initialSupply);
    await tokenContract.deployed();
    [owner, alice] = await ethers.getSigners();
  });

  describe("Deployment", function () {
    it("Should initialize contract with correct values", async () => {
      const tokenName = await tokenContract.name();
      assert.equal(ethers.utils.parseBytes32String(tokenName), "TestNetToken", "Sets correct name for token");
      const tokenSymbol = await tokenContract.symbol();
      console.log(tokenSymbol);
      assert.equal(ethers.utils.parseBytes32String(tokenSymbol), "TNT", "Sets correct symbol for token");
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
      await expect(tokenContract.transfer(alice.address, 1000001)).to.be.revertedWith(
        "You don't have enough TNT tokens to complete this transaction."
      );
    });

    it("Should transfer tokens and update balances", async () => {
      await expect(() => tokenContract.transfer(alice.address, 250)).to.changeTokenBalances(
        tokenContract,
        [owner, alice],
        [-250, 250]
      );
    });

    it("Should emit Transfer event on transfer", async () => {
      await expect(tokenContract.transfer(alice.address, 250))
        .to.emit(tokenContract, "Transfer")
        .withArgs(owner.address, alice.address, 250);
    });

    it("Should return 'true' when transfer successfully completes", async () => {
      // Using ether.js' .callStatic to simulate function as if executed on-chain in order to get return value
      // https://ethereum.stackexchange.com/a/109992
      const tx = await tokenContract.callStatic.transfer(alice.address, 250);
      assert.equal(tx, true, "Returns true on success");
    });
  });
});
