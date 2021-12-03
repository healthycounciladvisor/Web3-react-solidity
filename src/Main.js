import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";

import { tokenAddress, tokenABI, crowdSaleAddress, crowdSaleABI } from "./utils/contracts";

// TODO: Implement conditional rendering (spinner?)
// TODO: Connect with contracts
// TODO: Revise styling

const Main = () => {
  const { active, account, library, connector, activate, deactivate } = useWeb3React();
  const [loadingState, setLoadingState] = useState("not-loaded");
  const [tokenPrice, setTokenPrice] = useState();
  const [tokensSold, setTokensSold] = useState();
  const [totalTokens, setTotalTokens] = useState();
  const [userBalance, setUserBalance] = useState();

  async function loadData() {
    // Get ethers Web3Provider
    // Get contract instances
    // From crowdSaleContrat: get tokenPrice, tokensSold
    // From tokenContract: totalCrowdSaleSupply, userBalance
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
