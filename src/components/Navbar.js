import PropTypes from "prop-types";

import WalletModal from "./WalletModal";

const Navbar = (props) => {
  return (
    <nav>
      <button onClick={() => props.setShowWalletModal(true)}>Connect Wallet</button>
      {props.showWalletModal && (
        <WalletModal
          setShowWalletModal={props.setShowWalletModal}
          handleConnect={props.handleConnect}
          canConnect={props.canConnect}
          activatingConnector={props.activatingConnector}
          wallets={props.wallets}
          disconnectWallet={props.disconnectWallet}
        />
      )}
    </nav>
  );
};

Navbar.propTypes = {
  setShowWalletModal: PropTypes.func,
  showWalletModal: PropTypes.bool,
  walletConnected: PropTypes.bool,
  toggleWalletModal: PropTypes.func,
  disconnectWallet: PropTypes.func,
  setShowWalletModal: PropTypes.func,
  handleConnect: PropTypes.func,
  canConnect: PropTypes.bool,
  activatingConnector: PropTypes.any,
  chainIdIsCorrect: PropTypes.bool,
  wallets: PropTypes.array,
};

export default Navbar;
