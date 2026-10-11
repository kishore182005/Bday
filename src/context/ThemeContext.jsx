import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export const THEMES = [
  { id: 'sharmila-blue', label: "💙 Sharmila's Blue", color: '#38bdf8', desc: "Her favourite royal & sky blue" },
  { id: 'pastel', label: '🌸 Pastel Dream', color: '#ff7597', desc: 'Cute soft pink & lavender' },
  { id: 'midnight', label: '🌌 Midnight Galaxy', color: '#818cf8', desc: 'Cosmic indigo & violet' },
  { id: 'sunset', label: '🌅 Sunset Romance', color: '#fb923c', desc: 'Warm golden amber & rose' },
  { id: 'strawberry', label: '🍓 Sweet Berry', color: '#f43f5e', desc: 'Vibrant strawberry cuteness' }
];

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(() => {
    try {
      return localStorage.getItem('sharmila_bday_theme') || 'sharmila-blue';
    } catch (e) {
      return 'sharmila-blue';
    }
  });

  const setTheme = (newTheme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem('sharmila_bday_theme', newTheme);
    } catch (e) {}
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
