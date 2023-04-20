import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`
  body{
    background-color: ${(props)=>props.theme.colors.bgColor};
    color: ${(props)=>props.theme.colors.titleColor};
    transition: 0.5s all;
  }
`