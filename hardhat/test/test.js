const { assert } = require("chai");
const { ethers } = require("hardhat");

describe("Token Contract", function () {
  let TokenContract;
  let tokenContract;

  beforeEach(async () => {
    TokenContract = await ethers.getContractFactory("Token");
    tokenContract = await TokenContract.deploy();
    await tokenContract.deployed();
  });

  describe("Deployment", function () {
    it("Should set total supply on deployment", async () => {
      const deployedSupply = await tokenContract.totalSupply();
      assert.equal(
        deployedSupply.toNumber(),
        1000000,
        "Sets the total supply to 1,000,000"
      );
    });
  });
});
