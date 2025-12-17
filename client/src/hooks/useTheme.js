import { useState, useEffect } from 'react';

export const useTheme = () => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('unsaid-theme');
    if (savedTheme) return savedTheme;
    
    // Check system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Clear any existing theme classes
    root.classList.remove('light', 'dark');
    
    // For Tailwind, we only need to add 'dark' class for dark mode
    if (theme === 'dark') {
      root.classList.add('dark');
    }
    
    // Store your custom theme value in data attribute
    root.setAttribute('data-theme', theme);
    
    // Save to localStorage
    localStorage.setItem('unsaid-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return { theme, toggleTheme };
};