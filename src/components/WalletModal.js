import React from "react";
import PropTypes from "prop-types";
import ClickAwayListener from "react-click-away-listener";

import WalletButton from "./WalletButton";
import Wrapper from "../styles/WalletModal.styles";

const WalletModal = (props) => {
  const handleClickAway = () => {
    props.setShowWalletModal(false);
  };

  const buttons = props.wallets.map((wallet) => (
    <WalletButton
      key={wallet.name}
      connectFunction={wallet.connectFunction}
      selected={wallet.selected}
      activating={wallet.activating}
      active={wallet.active}
      name={wallet.name}
      Icon={wallet.icon}
    />
  ));

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Wrapper>
        <div className='wallet-modal'>
          {buttons}
          <div className='wallet-modal__button-container'>
            <button className='wallet-modal__button' disabled={!props.canConnect} onClick={props.handleConnect}>
              Connect
            </button>
            <button className='wallet-modal__button' onClick={props.disconnectWallet}>
              Disconnect
            </button>
          </div>
        </div>
      </Wrapper>
    </ClickAwayListener>
  );
};

WalletModal.propTypes = {
  setShowWalletModal: PropTypes.func,
  handleConnect: PropTypes.func,
  canConnect: PropTypes.bool,
  activatingConnector: PropTypes.any,
  disconnectWallet: PropTypes.func,
  wallets: PropTypes.array,
};

export default WalletModal;
