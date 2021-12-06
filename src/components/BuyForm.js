import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ethers, utils } from "ethers";

import EthLogo from "../assets/eth-diamond-purple.png";
import TNTLogo from "../assets/token-logo.png";

const BuyForm = () => {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const subscription = watch((value) => {
      console.log(value["ethAmt"]);
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  //   const buyTokens = async () => {
  //     const signer = library.getSigner(account);
  //     const swapExchangeContract = new ethers.Contract(swapExchangeAddress, swapExchangeABI, signer);
  //     const buyTx = await swapExchangeContract.buyTokens({ value: ethers.utils.parseEther("1") });
  //     await buyTx
  //       .wait()
  //       .catch((error) => console.log(error))
  //       .then((receipt) => console.log(receipt.transactionHash));
  //   };

  const onSubmit = async () => {
    // buyTokens();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='form-label'>
        <label>
          <b>Input</b>
        </label>
        <span>
          {/* Balance: <span>{userEthBalance}</span> ETH */}
          Balance: <span></span> ETH
        </span>
      </div>
      <div className='input-field'>
        <input
          type='number'
          name='ethAmt'
          id='ethAmt'
          placeholder='0'
          pattern='[0-9]'
          {...register("ethAmt", {
            required: "Enter a minimum of 1 ETH",
            valueAsNumber: true,
            min: { value: 1, message: "Swap a minimum of 1 ETH" },
          })}
        />
        <div className='token-logo'>
          <img src={EthLogo} height='32' alt='' />
          <p>ETH</p>
        </div>
      </div>
      {errors.ethAmt && <p className='error'>{errors.ethAmt.message}</p>}
      <div className='form-label'>
        <label>
          <b>Output</b>
        </label>
        <span>
          {/* Balance: <span>{userTokenBalance}</span> TNT */}
          Balance: <span></span> TNT
        </span>
      </div>
      <div className='input-field'>
        <input type='number' name='tntAmt' id='tntAmt' placeholder='0' disabled />
        <div className='token-logo'>
          <img src={TNTLogo} height='32' alt='' />
          <p>TNT</p>
        </div>
      </div>
      <div className='form-label'>
        {/* Exchange Rate: 1 ETH = <span>{exchangeRate}</span> TNT. */}
        <span>Exchange Rate:</span>
        <span>
          1 ETH = <span></span> TNT.
        </span>
      </div>
      <button type='submit'>Swap</button>
    </form>
  );
};

export default BuyForm;
