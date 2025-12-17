import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Shield, History as HistoryIcon, Home } from 'lucide-react';
import HomePage from './pages/Home';
import HistoryPage from './pages/History';
import ThemeToggle from './components/ThemeToggle';
import { useTheme } from './hooks/useTheme';

function App() {
  // Load currentPage from localStorage, default to 'home'
  const [currentPage, setCurrentPage] = useState(() => {
    const savedPage = localStorage.getItem('unsaid-current-page');
    return savedPage || 'home';
  });

  const { theme, toggleTheme } = useTheme();

  // Save currentPage to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('unsaid-current-page', currentPage);
  }, [currentPage]);

  // Also check URL hash on mount for compatibility
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash === 'history' || hash === 'home') {
      setCurrentPage(hash);
    }
  }, []);

  // Debug: Check if dark class is applied to html
  useEffect(() => {
    console.log('Current theme:', theme);
    console.log('HTML classes:', document.documentElement.classList);
  }, [theme]);

  const pageVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 }
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { id: 'history', label: 'History', icon: <HistoryIcon className="w-4 h-4" /> },
  ];

  // Update URL hash when page changes (optional, for shareable links)
  const handlePageChange = (pageId) => {
    setCurrentPage(pageId);
    window.location.hash = pageId; // Optional: update URL hash
  };

  return (
    <div className="min-h-screen transition-colors duration-300">
      {/* Navigation Bar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="fixed top-0 left-0 right-0 z-40 bg-white/80 dark:bg-purple-900/80 backdrop-blur-sm border-b border-calm-purple-200 dark:border-dark-purple-700"
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="p-2 rounded-lg bg-linear-to-r from-calm-purple-500 to-calm-blue-500"
              >
                <Brain className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h1 className="text-xl font-bold bg-linear-to-r from-calm-purple-600 to-calm-blue-600 bg-clip-text text-transparent">
                  UNSAID
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Emotional Translation Engine
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Navigation Items */}
              <div className="flex items-center gap-2">
                {navItems.map((item) => (
                  <motion.button
                    key={item.id}
                    onClick={() => handlePageChange(item.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                      currentPage === item.id
                        ? 'bg-linear-to-r from-calm-purple-500 to-calm-blue-500 text-white shadow-lg'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-calm-purple-100 dark:hover:bg-purple-800'
                    }`}
                  >
                    {item.icon}
                    <span className="hidden sm:inline">{item.label}</span>
                  </motion.button>
                ))}
              </div>

              {/* Safety Badge */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-calm-blue-50 dark:bg-purple-800 text-calm-blue-700 dark:text-calm-blue-300"
              >
                <Shield className="w-4 h-4" />
                <span className="text-sm">Emotionally Safe</span>
              </motion.div>

              {/* Theme Toggle */}
              <ThemeToggle />
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className="pt-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="min-h-[calc(100vh-12rem)]"
          >
            {currentPage === 'home' ? (
              <HomePage onNavigate={handlePageChange} />
            ) : (
              <HistoryPage onNavigate={handlePageChange} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="py-6 border-t border-calm-purple-200 dark:border-dark-purple-700 bg-white/50 dark:bg-purple-900/50 backdrop-blur-sm"
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="text-gray-600 dark:text-gray-400">
                UNSAID • Emotional Translation Engine
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Not a substitute for professional help
              </p>
            </div>
            <div className="flex items-center gap-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePageChange('home')}
                className="text-sm text-calm-purple-600 dark:text-calm-purple-400 hover:underline focus:outline-none"
              >
                Terms
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => alert('Please reach out to appropriate professionals for support.')}
                className="text-sm text-calm-purple-600 dark:text-calm-purple-400 hover:underline focus:outline-none"
              >
                Safety
              </motion.button>
              <span className="text-sm text-gray-500 dark:text-gray-500">
                © {new Date().getFullYear()} UNSAID
              </span>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}

export default App;