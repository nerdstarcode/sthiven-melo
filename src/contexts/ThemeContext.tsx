'use client'
import React, { createContext, useState, useEffect, useContext } from 'react';
type DataContextData = {
  darkMode?: boolean;
  setDarkMode?: any;
}
const ThemeContext = createContext<DataContextData | null>(null);

export const ThemeProvider = ({ children }: any) => {
  const [darkMode, setDarkMode] = useState(true);
  useEffect(() => {
    const HTMLTag = window.document.getElementsByTagName('html')[0];
    if (darkMode){
      HTMLTag.classList.add('dark')
    }else{
      HTMLTag.classList.remove('dark')
    }
  }, [darkMode]);

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext) as DataContextData;

