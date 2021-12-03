const { ethers } = require("hardhat");

async function main() {
  const TestNetToken = await ethers.getContractFactory("TestNetToken");
  const initialSupply = 1000000;
  const testNetToken = await TestNetToken.deploy(initialSupply);
  await testNetToken.deployed();
  console.log("TestNetToken deployed to:", testNetToken.address);

  const TestNetCrowdSale = await ethers.getContractFactory("TestNetCrowdSale");
  const tokenPrice = ethers.utils.parseEther("0.01");
  const testNetCrowdSale = await TestNetCrowdSale.deploy(testNetToken.address, tokenPrice);
  await testNetCrowdSale.deployed();
  console.log("TestNetCrowdSale deployed to:", testNetCrowdSale.address);

  // Provide CrowdSale with 75% of initialSupply
  const crowdSaleSupply = 750000;
  testNetToken.transfer(testNetCrowdSale.address, crowdSaleSupply);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
