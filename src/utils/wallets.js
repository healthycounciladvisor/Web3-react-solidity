const isMetaMaskEnabled = () => {
  try {
    if (window.ethereum) {
      if (window.ethereum.isMetaMask === true) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  } catch (error) {
    console.log("Error while checking if MetaMask installed: ", error);
    return false;
  }
};

const enableAccount = async (provider) => {
  return await provider.enable();
};

export { isMetaMaskEnabled, enableAccount };
