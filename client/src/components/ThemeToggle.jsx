import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative p-2 rounded-full bg-calm-purple-100 dark:bg-purple-800 hover:bg-calm-purple-200 dark:hover:bg-purple-700 transition-all duration-300"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Toggle theme"
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === 'dark' ? 180 : 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-center w-6 h-6"
      >
        {theme === 'light' ? (
          <Moon className="w-5 h-5 text-calm-purple-600 dark:text-calm-purple-300" />
        ) : (
          <Sun className="w-5 h-5 text-calm-purple-300" />
        )}
      </motion.div>
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-calm-purple-300 dark:border-calm-purple-600"
        initial={false}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 0.5 }}
        key={theme}
      />
    </motion.button>
  );
};

export default ThemeToggle;