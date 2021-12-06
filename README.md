# Token Experiments

Experimenting with Ethereum tokens using Solidity.

## Roadmap

Soldity

:white_check_mark: TestNetToken: handle false return value for transfer(), approve()
:white_check_mark: TestNetToken: implement increase/decrease allowance methods
:white_check_mark: TestNetCrowdSale: handle false return value for transfer method in buyTokens(), endSale()
:heavy_check_mark: TestNetSwap: finalize sellTokens functionality
:white_check_mark: TestNetSwap.test: Update test for Buy Tokens > "Should revert if transaction would exceed exchange contract's total supply"
:white_check_mark: Explore options for safe arithmetic operations (e.g. OpenZeppelin's SafeMath)
:white_check_mark: Check for vulnerabilities in code

Front-end

:white_check_mark: Revise styling
:heavy_check_mark: Add Identicon
:white_check_mark: Add non-MetaMask wallet option
:heavy_check_mark: Connect with contracts with browser (web3-react)
:heavy_check_mark: Implement conditional rendering (e.g. when fetching data from blockchain)
:white_check_mark: Code clean-up

### References

- Dapp University's [Code Your Own Cryptocurrency on Ethereum Series](https://www.youtube.com/playlist?list=PLS5SEs8ZftgWFuKg2wbm_0GLV0Tiy1R-n)
- Dapp University's [The Ultimate Cryptocurrency Programming Tutorial](https://www.youtube.com/playlist?list=PLS5SEs8ZftgXHEtZ19lXmDQZm_1JKaBTK)
- Linum Lab's [Warp Core](https://gitlab.com/linumlabs/warp-core/) for implementation of [web3-react](https://github.com/NoahZinsmeister/web3-react)

### Tech Stack

- [Ethers.js](https://docs.ethers.io/)
- [Hardhat](https://hardhat.org/getting-started/)
- [JavaScript](https://www.javascript.com/)
- [React](https://reactjs.org/)
- [Solidity](https://docs.soliditylang.org)

This project was bootstrapped with Create React App. You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).
