import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Nunito+Sans:wght@300;400;600;700&display=swap");

  *, *::before, *::after {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family: "Nunito Sans", sans-serif;
    color: ${({ theme }) => theme.colors.text};
    background: radial-gradient(circle at top, rgba(255, 111, 177, 0.18), transparent 45%),
      radial-gradient(circle at 15% 20%, rgba(255, 158, 199, 0.25), transparent 40%),
      ${({ theme }) => theme.colors.bg};
    min-height: 100vh;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  img {
    max-width: 100%;
    display: block;
  }

  button {
    font-family: "Nunito Sans", sans-serif;
  }
`;

export default GlobalStyle;
