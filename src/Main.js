import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";

import { tokenAddress, tokenABI, swapExchangeAddress, swapExchangeABI } from "./utils/contracts";

const Main = () => {
  const { account, activate, active, chainId, connector, deactivate, error, library, provider, setError } =
    useWeb3React();
  const [loadingState, setLoadingState] = useState("not-loaded");
  const [tokenPrice, setTokenPrice] = useState();
  const [tokensSold, setTokensSold] = useState();
  const [totalTokens, setTotalTokens] = useState();
  const [userBalance, setUserBalance] = useState();

  useEffect(() => {
    if (!!library && account) {
      loadData();
    }
  }, [library, account]);

  async function loadData() {
    let userBalance = await library.getBalance(account);
    userBalance = parseFloat(ethers.utils.formatEther(`${userBalance}`));
    console.log(userBalance);

    const signer = library.getSigner(account);
    const tokenContract = new ethers.Contract(tokenAddress, tokenABI, library);
    const tokenBalance = await tokenContract.balanceOf(account);
    console.log(tokenBalance);
    // From crowdSaleContrat: get tokenPrice, tokensSold
    // From tokenContract: totalCrowdSaleSupply, userBalance
    // window.alert('Contract not deployed to current network. Please change to a supported chain')
  }

  return (
    <>
      <main className='text-center'>
        <p>
          Token price is <span>{tokenPrice}</span> ETH.
        </p>
        <p>
          You currently have <span>{userBalance}</span> TNT.
        </p>
        <form>
          <input type='number' defaultValue='1' min='1' pattern='[0-9]' />
          <button type='submit'>Buy Tokens</button>
        </form>
        <div className='progress-bar' aria-valuemin='0' aria-valuemax='100'></div>
        <p>
          <span>{tokensSold}</span> / <span>{totalTokens}</span> tokens sold
        </p>
      </main>
    </>
  );
};

export default Main;
