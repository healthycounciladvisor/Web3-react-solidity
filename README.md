# Token Experiments

Experimenting with Ethereum tokens using Solidity.

## Roadmap

#### Solidity

- [ ] TestNetToken: handle false return value for transfer(), approve()
- [ ] TestNetToken: implement increase/decrease allowance methods
- [ ] TestNetCrowdSale: handle false return value for transfer method in buyTokens(), endSale()
- [x] TestNetSwap: finalize sellTokens functionality
- [ ] TestNetSwap.test: Update test for Buy Tokens > "Should revert if transaction would exceed exchange contract's total supply"
- [ ] Explore options for safe arithmetic operations (e.g. OpenZeppelin's SafeMath)
- [ ] Check for vulnerabilities in code
- [ ] Refactor contracts to use OpenZeppelin's ERC20 standard where applicable
- [ ] Deploy to at least one live testnet (e.g. Rinkeby)

#### Front-end

- [ ] Revise styling
- [x] Add Identicon
- [ ] Add non-MetaMask wallet option
- [x] Connect contracts with browser (web3-react)
- [x] Implement conditional rendering when waiting for wallet connection
- [ ] Implement conditional rendering when transaction in progress
- [ ] Keep wallet connection on refresh
- [ ] Update ETH/TNT balances live (e.g. after transaction)
- [ ] Implement defensive checks for form input
- [x] Implement conditional status text for wallet modal button
- [ ] Display error message if user connects on an unsupported chain
- [ ] Code clean-up

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

This project was bootstrapped with Create React App. Learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).
