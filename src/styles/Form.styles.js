import styled from "styled-components";

const StyledForm = styled.div`
  max-width: 600px;
  margin: 0 auto;
  border: 1px solid black;
  border-radius: 6px;
  padding: 1rem;
  margin-top: 1rem;
  margin-bottom: 1rem;

  form {
    width: 100%;
  }

  .form-label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;

    span {
      color: #6c757d;
    }
  }

  .input-field {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 1.5rem;

    input {
      border-top-right-radius: 0px;
      border-bottom-right-radius: 0px;
      flex: 1;
    }

    .token-logo {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 10px;
      padding: 0.25em 1em;
      background-color: #e5e7eb;
      border-top-right-radius: 6px;
      border-bottom-right-radius: 6px;
    }
  }

  button {
    display: block;
    border: none;
    padding: 0.5em 2em;
    text-decoration: none;
    width: 100%;
    font-size: 1rem;
    font-weight: bold;
    text-transform: uppercase;
    color: var(--white);
    background: #3b82f6;
    letter-spacing: 1px;
    transition: 200ms ease-in-out;
    border-radius: 4px;
    margin: 1rem auto;
    cursor: pointer;

    &:hover {
      background: #1d4ed8;
    }
  }
`;

export default StyledForm;
