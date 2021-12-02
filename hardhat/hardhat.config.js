require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    gasReporter: {
      url: "http://localhost:8545",
      currency: "CAD",
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
