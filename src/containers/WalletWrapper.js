import React, { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import Identicon from "identicon.js";

import useToggle from "../hooks/useToggle";
import { injectedConnector } from "../utils/connectors";
import { isMetaMaskEnabled } from "../utils/wallets";
import { shortenAddress } from "../utils";

import Navbar from "../components/Navbar";

import Nav from "../styles/Navbar.styles";
import { MetaMask } from "../assets/icons";

export default function WalletWrapper(props) {
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
    <>
      <Nav>
        <Navbar
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
        {account ? (
          <div className='wallet'>
            <p className='address'>{`${shortenAddress(account)}`}</p>
            <img
              className='identicon'
              style={{ margin: "0 auto", width: "30", height: "30" }}
              src={`data:image/png;base64,${new Identicon(account, 30).toString()}`}
            />
          </div>
        ) : (
          <span>Connect a wallet to interact.</span>
        )}
      </Nav>
      {props.children}
    </>
  );
}
