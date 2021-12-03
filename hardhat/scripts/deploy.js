const { ethers } = require("hardhat");

async function main() {
  const TestNetToken = await ethers.getContractFactory("TestNetToken");
  const testNetToken = await TestNetToken.deploy();
  await testNetToken.deployed();
  console.log("TestNetToken deployed to:", testNetToken.address);

  const TestNetCrowdSale = await ethers.getContractFactory("TestNetCrowdSale");
  const tokenPrice = ethers.utils.parseEther("0.01");
  const testNetCrowdSale = await TestNetCrowdSale.deploy(testNetToken.address, tokenPrice);
  await testNetCrowdSale.deployed();
  console.log("TestNetCrowdSale deployed to:", testNetCrowdSale.address);

  const TestNetSwap = await ethers.getContractFactory("TestNetSwap");
  const testNetSwap = await TestNetSwap.deploy(testNetToken.address);
  await testNetSwap.deployed();
  console.log("TestNetSwap deployed to:", testNetSwap.address);

  // Provide CrowdSale with 75% of initialSupply
  // const crowdSaleSupply = 750000;
  // testNetToken.transfer(testNetCrowdSale.address, crowdSaleSupply);

  // Provide Swap Exchange with 100% supply
  const totalSupply = await testNetToken.totalSupply();
  testNetToken.transfer(testNetSwap.address, totalSupply);

  // OR with remaining supply (owner balance) after crowd sale
  // const remainingSupply = await testNetToken.balanceOf(owner.address);
  // testNetToken.transfer(testNetSwap.address, remainingSupply);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
