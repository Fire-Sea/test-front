import { useState } from "react";

export const useTheme = ()=>{

  const isBrowserDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark').matches;
  let initTheme = isBrowserDarkMode ? 'dark' : 'light';

  const localSettingTheme = localStorage.getItem('theme');

  if(localSettingTheme){
    initTheme = localSettingTheme;
  }

  const [theme, setTheme] = useState(initTheme);

  const setMode = mode =>{
    window.localStorage.setItem('theme', mode)
    setTheme(mode);
  }

  const toggleTheme = () => setMode(theme === 'light' ? 'dark' : 'light');

  return [theme, toggleTheme];
}