import styled from "styled-components";

// TODO: Revise styling

const Wrapper = styled.button`
  background-color: lightgray;
  width: 80%;
  height: 20%;
  border-radius: 10px;
  margin: auto;
  border: 1px solid black;
  transition: 0.3s ease-in-out;

  &:selected {
    border: 2px solid teal;
  }

  &:hover {
    filter: brightness(1.1);
  }

  .container {
    width: 100%;
    height: 50%;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .label-container {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin: auto auto auto 10%;
      width: fit-content;

      p {
        margin: auto 2rem auto 0;
        font-size: 2rem;
        text-transform: capitalize;
      }

      .check {
        margin: auto auto auto 2rem;
        height: 80%;
        width: 4rem;
        color: teal;
      }
    }

    .icon {
      height: 100%;
      margin: auto 10% auto auto;
    }
  }
`;

export default Wrapper;
