import { InjectedConnector } from "@web3-react/injected-connector";

export const supportedChains = {
  0: "Not connected",
  4: "Rinkeby",
  1337: "Dev",
  31337: "Hardhat",
};

export const injectedConnector = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 1337, 31337],
});
