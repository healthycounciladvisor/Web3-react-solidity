import React, { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";

import useToggle from "../hooks/useToggle";
import { injectedConnector } from "../utils/connectors";
import { isMetaMaskEnabled } from "../utils/wallets";
import { shortenAddress } from "../utils";

import Onboard from "../components/Onboard";
import Main from "../Main";
import { MetaMask } from "../assets/icons";

// TODO: Add non-MetaMask wallet option

export default function WalletWrapper() {
  const [showWalletModal, setShowWalletModal, toggleWalletModal] = useToggle(false);
  const [wallet, setWallet] = useState(undefined);
  const [metaMaskEnabled, setMetaMaskEnabled] = useState(false);
  const [activatingConnector, setActivatingConnector] = useState();
  const { connector, activate, deactivate, active, account, chainId } = useWeb3React();

  useEffect(() => {
    const enabled = isMetaMaskEnabled();
    setMetaMaskEnabled(enabled);
  }, []);

  useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined);
    }

    active && setShowWalletModal(false);
  }, [activatingConnector, connector, active, setShowWalletModal]);

  const connectMetaMask = () => {
    setWallet(injectedConnector);
  };

  const disconnectWallet = () => {
    deactivate();
  };

  const handleConnect = async () => {
    setActivatingConnector(wallet);
    let web3 = new Web3Provider(window.ethereum);
    await activate(wallet);
    let { provider } = await wallet.activate();
    web3 = new Web3Provider(provider);
    setActivatingConnector(null);
  };

  const wallets = [
    {
      name: "metamask",
      connectFunction: connectMetaMask,
      selected: wallet === injectedConnector,
      activating: activatingConnector === injectedConnector,
      active: connector === injectedConnector,
      icon: MetaMask,
    },
  ];

  const enabledWallets = !metaMaskEnabled ? wallets.filter((wallet) => wallet.name !== "metamask") : wallets;

  const chainIdIsCorrect = chainId && chainId.toString() === "31337";

  return (
    <header className='text-center'>
      <h1>TestNetToken Crowd Sale</h1>
      <Onboard
        showWalletModal={showWalletModal}
        setShowWalletModal={setShowWalletModal}
        walletConnected={active}
        toggleWalletModal={toggleWalletModal}
        disconnectWallet={disconnectWallet}
        wallets={enabledWallets}
        canConnect={wallet && true}
        handleConnect={handleConnect}
        activatingConnector={activatingConnector}
        chainIdIsCorrect={chainIdIsCorrect}
      />
      <p>{account ? `Your Account: ${shortenAddress(account)}` : "Connect a wallet to interact."}</p>
      <Main />
    </header>
  );
}
