import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ethers, utils } from "ethers";

import EthLogo from "../assets/eth-diamond-purple.png";
import TNTLogo from "../assets/token-logo.png";

const SellForm = ({ userEthBalance, userTokenBalance, exchangeRate, sellTokens }) => {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [tokenAmount, setTokenAmount] = useState(1);
  const [output, setOutput] = useState(0);

  useEffect(() => {
    const subscription = watch((value) => {
      setTokenAmount(value["tntAmt"]);
      setOutput(value["tntAmt"] / 100);
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmit = async (e) => {
    e.preventDefault();
    await handleSubmit(sellTokens(tokenAmount));
  };

  return (
    // <form onSubmit={onSubmit}>
    <form onSubmit={onSubmit}>
      <div className='form-label'>
        <label>
          <b>Input</b>
        </label>
        <span>
          Balance: <span>{userTokenBalance}</span> TNT
        </span>
      </div>
      <div className='input-field'>
        <input
          type='number'
          name='tntAmt'
          id='tntAmt'
          placeholder='0'
          pattern='[0-9]'
          {...register("tntAmt", {
            required: "Enter a minimum of 1 TNT",
            valueAsNumber: true,
            min: { value: 1, message: "Swap a minimum of 1 TNT" },
          })}
        />
        <div className='token-logo'>
          <img src={TNTLogo} height='32' alt='' />
          <p>TNT</p>
        </div>
      </div>
      {errors.tntAmt && <p className='error'>{errors.tntAmt.message}</p>}
      <div className='form-label'>
        <label>
          <b>Output</b>
        </label>
        <span>
          Balance: <span>{userEthBalance}</span> ETH
        </span>
      </div>
      <div className='input-field'>
        <input type='number' name='ethAmt' id='ethAmt' placeholder='0' pattern='[0-9]' value={output} disabled />
        <div className='token-logo'>
          <img src={EthLogo} height='32' alt='' />
          <p>ETH</p>
        </div>
      </div>
      <div className='form-label'>
        <span>Exchange Rate:</span>
        <span>
          <span>{exchangeRate}</span> TNT = 1 ETH
        </span>
      </div>
      <button type='submit'>Swap</button>
    </form>
  );
};

export default SellForm;
