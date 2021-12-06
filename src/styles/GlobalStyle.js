import { createGlobalStyle } from "styled-components";

// Workaround for auto-formatting createGlobalStyle
// https://github.com/styled-components/vscode-styled-components/issues/175#issuecomment-798791843
const styled = { createGlobalStyle };

const GlobalStyle = styled.createGlobalStyle`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  :root {
    --white: #f9fafb;
    --black: #1d1e22;

    --fs-h1: 3rem;
    --fs-h2: 2.25rem;
    --fs-h3: 1.25rem;
    --fs-body: 1rem;

    @media (min-width: 800px) {
      --fs-h1: 4em;
      --fs-h2: 3rem;
      --fs-h3: 1.5rem;
      --fs-body: 1.125rem;
    }
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    margin: 0;
  }

  h1,
  h2,
  h3 {
    line-height: 1;
    margin: 0;
  }

  h1 {
    font-size: var(--fs-h1);
  }

  h2 {
    font-size: var(--fs-h2);
  }

  h3 {
    font-size: var(--fs-h3);
  }

  p {
    font-size: var(---fs-body);
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  a {
    text-decoration: none;
  }

  input {
    padding: 0.63em 1em;
    border: 1px solid rgba(0, 0, 0, 0.3);
    font-size: 1rem;
    border-radius: 6px;

    &:focus {
      outline: 1px solid #93c5fd;
    }

    &:disabled {
      background-color: #e5e7eb;
    }
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type="number"] {
    -moz-appearance: textfield;
  }

  button {
    display: block;
    border: none;
    padding: 0.5em 2em;
    text-decoration: none;
    cursor: pointer;
    font-size: 1rem;
    font-weight: bold;
    transition: 200ms ease-in-out;
    border-radius: 4px;
    margin: 1rem auto;

    &:hover {
      color: var(--white);
      background: rgba(0, 0, 0, 0.8);
    }
  }

  img {
    display: block;
    max-width: 100%;
  }

  .text-center {
    text-align: center;
  }
`;

export default GlobalStyle;
