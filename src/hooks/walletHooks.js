import { useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { injectedConnector } from "../utils/connectors";

function useInactiveListener(suppress = false) {
  const { active, activate, deactivate } = useWeb3React();

  useEffect(() => {
    const { ethereum } = window;
    if (ethereum && ethereum.on && active && !suppress) {
      const handleChainChanged = (chainId) => {
        console.log("chainChanged: ", chainId);
        activate(injectedConnector);
      };

      const handleAccountsChanged = (accounts) => {
        console.log("accountsChanged: ", accounts);
        if (accounts.length > 0) {
          activate(injectedConnector);
        } else {
          console.log("Disconnected via wallet");
          deactivate();
        }
      };

      ethereum.on("chainChanged", handleChainChanged);
      ethereum.on("accountsChanged", handleAccountsChanged);

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener("chainChanged", handleChainChanged);
          ethereum.removeListener("accountsChanged", handleAccountsChanged);
        }
      };
    }
    return () => {};
  }, [active, suppress, activate]);
}

export default useInactiveListener;
