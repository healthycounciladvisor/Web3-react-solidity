import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { useForm } from "react-hook-form";

import { tokenAddress, tokenABI, swapExchangeAddress, swapExchangeABI } from "./utils/contracts";
import BuyForm from "./components/BuyForm";
import SellForm from "./components/SellForm";

import StyledForm from "./styles/Form.styles";

const Main = () => {
  const { account, library } = useWeb3React();
  const [loadingState, setLoadingState] = useState("loading");
  const [currentForm, setCurrentForm] = useState("buy");
  const [activeButton, setActiveButton] = useState(0);
  const [exchangeRate, setExchangeRate] = useState();
  const [userEthBalance, setUserEthBalance] = useState();
  const [userTokenBalance, setUserTokenBalance] = useState();

  useEffect(() => {
    if (!!library && account) {
      loadData();
    }
  }, [library, account]);

  async function loadData() {
    if (!!library && typeof tokenAddress !== "undefined") {
      const tokenContract = new ethers.Contract(tokenAddress, tokenABI, library);
      const swapExchangeContract = new ethers.Contract(swapExchangeAddress, swapExchangeABI, library);

      let userBalance = await library.getBalance(account);
      userBalance = parseFloat(ethers.utils.formatEther(`${userBalance}`));
      setUserEthBalance(userBalance);

      let tokenBalance = await tokenContract.balanceOf(account);
      tokenBalance = parseInt(ethers.utils.formatEther(`${tokenBalance}`));
      setUserTokenBalance(tokenBalance);

      let exchangeRate = await swapExchangeContract.exchangeRate();
      exchangeRate = exchangeRate.toNumber();
      setExchangeRate(exchangeRate);

      setLoadingState("loaded");
    }
  }

  const buyTokens = async (etherAmount) => {
    const signer = library.getSigner(account);
    const swapExchangeContract = new ethers.Contract(swapExchangeAddress, swapExchangeABI, signer);
    const buyTx = await swapExchangeContract.buyTokens({ value: ethers.utils.parseEther(`${etherAmount}`) });
    await buyTx
      .wait()
      .catch((error) => console.log(error))
      .then((receipt) => console.log(receipt.transactionHash));
  };

  const sellTokens = async (tokenAmount) => {
    const signer = library.getSigner(account);
    const tokenContract = new ethers.Contract(tokenAddress, tokenABI, signer);
    const swapExchangeContract = new ethers.Contract(swapExchangeAddress, swapExchangeABI, signer);
    const approveTx = await tokenContract.approve(
      swapExchangeContract.address,
      ethers.utils.parseEther(`${tokenAmount}`)
    );
    approveTx
      .wait()
      .catch((error) => console.log(error))
      .then((receipt) => console.log(receipt.transactionHash));

    const sellTx = await swapExchangeContract.sellTokens(ethers.utils.parseEther(`${tokenAmount}`));
    await sellTx
      .wait()
      .catch((error) => console.log(error))
      .then((receipt) => console.log(receipt.transactionHash));
  };

  return (
    <>
      {loadingState === "loading" ? (
        <p className='text-center'>Waiting for wallet connection...</p>
      ) : (
        <main className='text-center'>
          <h1>TestNetToken Swap Exchange</h1>
          <div className='form-switcher'>
            <button
              className={`${activeButton === 0 ? "active" : null}`}
              onClick={() => {
                setActiveButton(0);
                setCurrentForm("buy");
              }}
            >
              Buy
            </button>
            <button
              className={`${activeButton === 1 ? "active" : null}`}
              onClick={() => {
                setActiveButton(1);
                setCurrentForm("sell");
              }}
            >
              Sell
            </button>
          </div>
          <StyledForm>
            {currentForm === "buy" ? (
              <BuyForm
                userEthBalance={userEthBalance}
                userTokenBalance={userTokenBalance}
                exchangeRate={exchangeRate}
                buyTokens={buyTokens}
              />
            ) : (
              <SellForm
                userEthBalance={userEthBalance}
                userTokenBalance={userTokenBalance}
                exchangeRate={exchangeRate}
                sellTokens={sellTokens}
              />
            )}
          </StyledForm>
        </main>
      )}
    </>
  );
};

export default Main;
