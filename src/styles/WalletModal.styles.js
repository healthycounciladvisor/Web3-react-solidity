import styled from "styled-components";

const Wrapper = styled.div`
  .wallet-modal {
    background-color: var(--white);
    border: 1px solid grey;
    width: 40rem;
    height: 40rem;
    display: flex;
    flex-direction: column;
    border-radius: 1rem;
    position: absolute;
    top: calc(50% - 20rem);
    left: calc(50% - 20rem);
    z-index: 5;
  }

  .wallet-modal__button-container {
    display: flex;
    width: 100%;
    margin: auto;

    .wallet-modal__button {
      border: 2px solid black;
      border-radius: 5px;
      padding: 1rem 2rem;
      margin: auto;
    }
  }
`;

export default Wrapper;
