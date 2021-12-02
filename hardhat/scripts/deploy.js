const { ethers } = require("hardhat");

async function main() {
  const Token = await ethers.getContractFactory("Token");
  const initialSupply = 1000000;
  const token = await Token.deploy(initialSupply);
  await token.deployed();
  console.log("Token deployed to:", token.address);

  const TokenSwap = await ethers.getContractFactory("TokenSwap");
  const tokenPrice = ethers.utils.parseEther("0.01");
  const tokenSwap = await TokenSwap.deploy(token.address, tokenPrice);
  await tokenSwap.deployed();
  console.log("TokenSwap deployed to:", tokenSwap.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
