import WalletWrapper from "./containers/WalletWrapper";
import Main from "./Main";
import GlobalStyle from "./styles/GlobalStyle";

function App() {
  return (
    <>
      <GlobalStyle />
      <WalletWrapper>
        <Main />
      </WalletWrapper>
    </>
  );
}

export default App;
