import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  History as HistoryIcon, 
  Trash2, 
  Copy, 
  Check,
  Filter,
  Search,
  Calendar,
  Clock
} from 'lucide-react';
import HistoryCard from '../components/HistoryCard';
import { getTranslationHistory } from '../services/api';

const History = ({ onNavigate }) => {
  const [translations, setTranslations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmotion, setSelectedEmotion] = useState('all');
  const [copiedId, setCopiedId] = useState(null);
  const [sessionId] = useState(() => 
    localStorage.getItem('unsaid-session-id') || 'default'
  );

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const result = await getTranslationHistory(sessionId);
      if (result.success) {
        setTranslations(result.translations || []);
      } else {
        setError('Failed to load history');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const handleDelete = async (id) => {
    // In a real app, you would call an API to delete
    setTranslations(prev => prev.filter(t => t._id !== id));
  };

  const handleDeleteAll = () => {
    if (window.confirm('Are you sure you want to delete all history?')) {
      setTranslations([]);
    }
  };

  const filteredTranslations = translations.filter(translation => {
    const matchesSearch = searchTerm === '' || 
      translation.rawText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      translation.clearExpression.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesEmotion = selectedEmotion === 'all' || 
      translation.emotions.includes(selectedEmotion);
    
    return matchesSearch && matchesEmotion;
  });

  const allEmotions = Array.from(
    new Set(translations.flatMap(t => t.emotions))
  ).sort();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-light dark:bg-gradient-dark transition-all duration-500">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <motion.button
                onClick={() => onNavigate('home')}
                whileHover={{ scale: 1.05, x: -5 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg bg-white/70 dark:bg-dark-purple-800/70 backdrop-blur-sm border border-calm-purple-200 dark:border-dark-purple-700 hover:border-calm-purple-300 dark:hover:border-dark-purple-600"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5 text-calm-purple-600 dark:text-calm-purple-400" />
              </motion.button>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-linear-to-r from-calm-purple-500 to-calm-blue-500">
                  <HistoryIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
                    Translation History
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Your emotional journey, preserved
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <motion.button
                onClick={loadHistory}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-lg bg-calm-blue-100 dark:bg-dark-purple-800 text-calm-blue-700 dark:text-calm-blue-300 hover:bg-calm-blue-200 dark:hover:bg-dark-purple-700 transition-colors flex items-center gap-2"
              >
                <Clock className="w-4 h-4" />
                Refresh
              </motion.button>
              {translations.length > 0 && (
                <motion.button
                  onClick={handleDeleteAll}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 rounded-lg bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 hover:bg-rose-200 dark:hover:bg-rose-900/50 transition-colors flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear All
                </motion.button>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/70 dark:bg-dark-purple-800/70 backdrop-blur-sm rounded-xl p-4 border border-calm-purple-200 dark:border-dark-purple-700"
            >
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Translations</p>
              <p className="text-2xl font-bold text-calm-purple-600 dark:text-calm-purple-400">
                {translations.length}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/70 dark:bg-dark-purple-800/70 backdrop-blur-sm rounded-xl p-4 border border-calm-purple-200 dark:border-dark-purple-700"
            >
              <p className="text-sm text-gray-600 dark:text-gray-400">Unique Emotions</p>
              <p className="text-2xl font-bold text-calm-blue-600 dark:text-calm-blue-400">
                {allEmotions.length}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/70 dark:bg-dark-purple-800/70 backdrop-blur-sm rounded-xl p-4 border border-calm-purple-200 dark:border-dark-purple-700"
            >
              <p className="text-sm text-gray-600 dark:text-gray-400">Most Recent</p>
              <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 truncate">
                {translations[0]?.clearExpression?.substring(0, 40) || 'None yet'}...
              </p>
            </motion.div>
          </div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/70 dark:bg-dark-purple-800/70 backdrop-blur-sm rounded-xl p-4 border border-calm-purple-200 dark:border-dark-purple-700 mb-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Search className="w-4 h-4" />
                  Search translations
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by text or emotion..."
                  className="w-full p-3 rounded-lg border border-calm-purple-200 dark:border-dark-purple-700 bg-white dark:bg-dark-purple-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:border-calm-purple-500 dark:focus:border-calm-purple-400"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Filter className="w-4 h-4" />
                  Filter by emotion
                </label>
                <select
                  value={selectedEmotion}
                  onChange={(e) => setSelectedEmotion(e.target.value)}
                  className="w-full p-3 rounded-lg border border-calm-purple-200 dark:border-dark-purple-700 bg-white dark:bg-dark-purple-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:border-calm-purple-500 dark:focus:border-calm-purple-400"
                >
                  <option value="all">All Emotions</option>
                  {allEmotions.map(emotion => (
                    <option key={emotion} value={emotion}>
                      {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        </motion.header>

        {/* Main Content */}
        <motion.main
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-calm-purple-500 border-t-transparent"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your history...</p>
            </div>
          ) : error ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="p-4 rounded-full bg-rose-100 dark:bg-rose-900/30 w-fit mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-rose-600 dark:text-rose-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Could not load history
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
              <button
                onClick={loadHistory}
                className="px-4 py-2 rounded-lg bg-calm-purple-500 text-white hover:bg-calm-purple-600 transition-colors"
              >
                Try Again
              </button>
            </motion.div>
          ) : filteredTranslations.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="p-4 rounded-full bg-calm-blue-100 dark:bg-dark-purple-800 w-fit mx-auto mb-4">
                <Calendar className="w-8 h-8 text-calm-blue-600 dark:text-calm-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                No translations yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {searchTerm || selectedEmotion !== 'all' 
                  ? 'No translations match your filters' 
                  : 'Start translating emotions to see them here'}
              </p>
              {searchTerm || selectedEmotion !== 'all' ? (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedEmotion('all');
                  }}
                  className="px-4 py-2 rounded-lg bg-calm-purple-100 dark:bg-dark-purple-800 text-calm-purple-700 dark:text-calm-purple-300 hover:bg-calm-purple-200 dark:hover:bg-dark-purple-700 transition-colors"
                >
                  Clear Filters
                </button>
              ) : (
                <button
                  onClick={() => onNavigate('home')}
                  className="px-4 py-2 rounded-lg bg-calm-purple-500 text-white hover:bg-calm-purple-600 transition-colors"
                >
                  Start Translating
                </button>
              )}
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AnimatePresence>
                {filteredTranslations.map((translation, index) => (
                  <HistoryCard
                    key={translation._id}
                    translation={translation}
                    index={index}
                    onCopy={(text) => handleCopy(text, translation._id)}
                    onDelete={handleDelete}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.main>

        {/* Copy Toast */}
        <AnimatePresence>
          {copiedId && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-4 right-4 z-50"
            >
              <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-emerald-500 text-white shadow-lg">
                <Check className="w-4 h-4" />
                <span>Copied to clipboard!</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default History;