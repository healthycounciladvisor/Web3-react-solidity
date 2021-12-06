import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { useForm } from "react-hook-form";

import { tokenAddress, tokenABI, swapExchangeAddress, swapExchangeABI } from "./utils/contracts";
import BuyForm from "./components/BuyForm";

import StyledForm from "./styles/Form.styles";

const Main = () => {
  const { account, activate, active, chainId, connector, deactivate, error, library, provider, setError } =
    useWeb3React();
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loadingState, setLoadingState] = useState("loading");
  const [tokenPrice, setTokenPrice] = useState();
  const [tokensSold, setTokensSold] = useState();
  const [totalTokens, setTotalTokens] = useState();
  const [exchangeRate, setExchangeRate] = useState();
  const [userEthBalance, setUserEthBalance] = useState();
  const [userTokenBalance, setUserTokenBalance] = useState();
  const [ethAmount, setEthAmount] = useState();
  const [tokenAmount, setTokenAmount] = useState(0);

  useEffect(() => {
    if (!!library && account) {
      loadData();
    }
    // window.alert('Contract not deployed to detected network. Please change to a supported chain')
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

      let totalSupply = await tokenContract.totalSupply();
      totalSupply = parseInt(ethers.utils.formatEther(`${totalSupply}`));
      setTotalTokens(totalSupply);
      // setTotalTokens(totalSupply.toLocaleString()); // with comma separators
      // From crowdSaleContract: tokensSold
      setLoadingState("loaded");
    }
  }

  useEffect(() => {
    const subscription = watch((value) => {
      // console.log(value["ethAmt"]);
      setEthAmount(value["ethAmt"]);
      console.log(ethAmount);
      // tokenQty = parseInt(ethers.utils.formatEther(`${tokenQty}`));
      // setTokenAmount(tokenQty);
    });

    return () => subscription.unsubscribe();
  }, [watch, ethAmount]);

  const buyTokens = async () => {
    const signer = library.getSigner(account);
    const swapExchangeContract = new ethers.Contract(swapExchangeAddress, swapExchangeABI, signer);
    const buyTx = await swapExchangeContract.buyTokens({ value: ethers.utils.parseEther("1") });
    await buyTx
      .wait()
      .catch((error) => console.log(error))
      .then((receipt) => console.log(receipt.transactionHash));
  };

  const onSubmit = async () => {
    buyTokens();
  };

  return (
    <>
      {loadingState === "loading" ? (
        <p className='text-center'>Waiting for wallet connection...</p>
      ) : (
        <main className='text-center'>
          <h1>TestNetToken Swap Exchange</h1>
          <StyledForm>
            <BuyForm />
          </StyledForm>
        </main>
      )}
    </>
  );
};

export default Main;
