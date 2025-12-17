import React, { useState, useEffect, useRef } from 'react';
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
  Clock,
  Star,
  Heart,
  TrendingUp,
  Sparkles,
  BookOpen,
  BarChart3,
  RefreshCw,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  Zap,
  Palette,
  Grid,
  List
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
  const [favorites, setFavorites] = useState(() => {
    // First try to load from 'favorites' key (object format from HistoryCard)
    const favoritesObj = JSON.parse(localStorage.getItem('favorites') || '{}');
    
    if (Object.keys(favoritesObj).length > 0) {
      // Convert object keys to array
      const favoriteIds = Object.keys(favoritesObj);
      console.log('Loaded favorites from "favorites" key:', favoriteIds);
      return favoriteIds;
    }
    
    // Fallback to 'unsaid-favorites' key (array format)
    const savedFavorites = JSON.parse(localStorage.getItem('unsaid-favorites') || '[]');
    console.log('Loaded favorites from "unsaid-favorites" key:', savedFavorites);
    return savedFavorites;
  });
  
  // Save favorites to BOTH localStorage keys for compatibility
  useEffect(() => {
    console.log('Saving favorites:', favorites);
    
    // Save to 'unsaid-favorites' as array
    localStorage.setItem('unsaid-favorites', JSON.stringify(favorites));
    
    // Also save to 'favorites' as object (for HistoryCard compatibility)
    const favoritesObj = {};
    favorites.forEach(id => {
      const translation = translations.find(t => t._id === id);
      if (translation) {
        favoritesObj[id] = {
          ...translation,
          timestamp: translation.timestamp || new Date().toISOString(),
          favoritedAt: new Date().toISOString()
        };
      }
    });
    localStorage.setItem('favorites', JSON.stringify(favoritesObj));
  }, [favorites, translations]);

  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showStats, setShowStats] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'favorites', 'recent'
  const [floatingHearts, setFloatingHearts] = useState([]);
  const containerRef = useRef(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      // Add loading animation
      createSparkleEffect();
      
      const result = await getTranslationHistory(sessionId);
      if (result.success) {
        setTranslations(result.translations || []);
        setError(null);
        
        // Trigger success animation
        setTimeout(() => {
          createHeartEffect();
        }, 300);
      } else {
        setError('Failed to load history');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createSparkleEffect = () => {
    const newSparkles = Array.from({ length: 8 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 1 + 0.5
    }));
    setFloatingHearts(newSparkles);
    setTimeout(() => setFloatingHearts([]), 1500);
  };

  const createHeartEffect = () => {
    const newHearts = Array.from({ length: 5 }).map((_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 80 + 10,
      y: 100,
      emoji: ['❤️', '💖', '✨', '🌟', '💫'][Math.floor(Math.random() * 5)]
    }));
    setFloatingHearts(prev => [...prev, ...newHearts]);
    setTimeout(() => {
      setFloatingHearts(prev => prev.filter(h => !newHearts.find(nh => nh.id === h.id)));
    }, 2000);
  };

  const handleCopy = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      
      // Create copy success animation
      const copyHearts = Array.from({ length: 3 }).map((_, i) => ({
        id: `copy-${Date.now()}-${i}`,
        x: Math.random() * 50 + 25,
        y: 90,
        emoji: '📋'
      }));
      setFloatingHearts(prev => [...prev, ...copyHearts]);
      
      setTimeout(() => setCopiedId(null), 2000);
      setTimeout(() => {
        setFloatingHearts(prev => prev.filter(h => !copyHearts.find(ch => ch.id === h.id)));
      }, 1500);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const handleDelete = async (id) => {
    // Add delete animation
    const cardElement = document.querySelector(`[data-id="${id}"]`);
    if (cardElement) {
      cardElement.style.transform = 'scale(0.8) rotate(5deg)';
      cardElement.style.opacity = '0.5';
      
      setTimeout(() => {
        setTranslations(prev => prev.filter(t => t._id !== id));
        setFavorites(prev => prev.filter(favId => favId !== id));
      }, 300);
    }
  };

  const handleDeleteAll = () => {
    if (window.confirm('Are you sure you want to delete all translations? This cannot be undone.')) {
      // Animate out all cards
      const cards = document.querySelectorAll('[data-id]');
      cards.forEach((card, index) => {
        card.style.transition = `all 0.3s ease ${index * 0.05}s`;
        card.style.transform = 'translateX(100px) rotate(10deg)';
        card.style.opacity = '0';
      });
      
      setTimeout(() => {
        setTranslations([]);
        setFavorites([]);
        localStorage.removeItem('unsaid-favorites');
      }, 500);
    }
  };

  const toggleFavorite = (id) => {
    if (favorites.includes(id)) {
      setFavorites(prev => prev.filter(favId => favId !== id));
    } else {
      setFavorites(prev => [...prev, id]);
      // Create favorite animation
      createHeartEffect();
    }
  };

  const toggleViewMode = () => {
    setViewMode(prev => prev === 'grid' ? 'list' : 'grid');
  };

  const getFilteredTranslations = () => {
    let filtered = translations;
    
    // Apply tab filter
    if (activeTab === 'favorites') {
      filtered = filtered.filter(t => favorites.includes(t._id));
    } else if (activeTab === 'recent') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      filtered = filtered.filter(t => new Date(t.timestamp) > oneWeekAgo);
    }
    
    // Apply search filter
    filtered = filtered.filter(translation => {
      const matchesSearch = searchTerm === '' || 
        translation.rawText.toLowerCase().includes(searchTerm.toLowerCase()) ||
        translation.clearExpression.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesEmotion = selectedEmotion === 'all' || 
        translation.emotions.includes(selectedEmotion);
      
      return matchesSearch && matchesEmotion;
    });
    
    return filtered;
  };

  const filteredTranslations = getFilteredTranslations();

  const allEmotions = Array.from(
    new Set(translations.flatMap(t => t.emotions))
  ).sort();

  // Calculate statistics
  const totalTranslations = translations.length;
  const totalFavorites = favorites.length;
  const totalEmotions = allEmotions.length;
  const mostCommonEmotion = translations.length > 0 
    ? Object.entries(
        translations.flatMap(t => t.emotions).reduce((acc, emotion) => {
          acc[emotion] = (acc[emotion] || 0) + 1;
          return acc;
        }, {})
      ).sort((a, b) => b[1] - a[1])[0][0]
    : 'none';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const statsVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5
      }
    })
  };

  const tabVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.05 },
    pressed: { scale: 0.95 }
  };

  return (
    <div className="min-h-screen bg-gradient-light dark:bg-gradient-dark transition-all duration-500 overflow-hidden relative">
      {/* Floating Hearts/Emojis */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {floatingHearts.map((heart) => (
          <motion.div
            key={heart.id}
            initial={{ y: heart.y, x: `${heart.x}%`, opacity: 1, scale: 0.5 }}
            animate={{ 
              y: -100, 
              opacity: 0,
              rotate: Math.random() * 360,
              scale: [0.5, 1.2, 0.8]
            }}
            transition={{ 
              duration: heart.duration || 2,
              ease: "easeOut"
            }}
            className="absolute text-2xl"
            style={{ left: `${heart.x}%` }}
          >
            {heart.emoji || '✨'}
          </motion.div>
        ))}
      </div>

      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-linear-to-r from-calm-purple-100/20 to-calm-blue-100/20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 4 + 1}px`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.sin(Date.now() * 0.001 + i) * 10, 0],
              opacity: [0.1, 0.4, 0.1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl relative z-20" ref={containerRef}>
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <motion.button
                onClick={() => onNavigate('home')}
                whileHover={{ scale: 1.05, x: -5 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 rounded-xl bg-white/80 dark:bg-purple-800/80 backdrop-blur-sm border border-calm-purple-200 dark:border-dark-purple-700 hover:border-calm-purple-300 dark:hover:border-dark-purple-600 shadow-lg hover:shadow-xl transition-all duration-300 group"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5 text-calm-purple-600 dark:text-calm-purple-400 group-hover:-translate-x-1 transition-transform" />
              </motion.button>
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    repeatDelay: 2
                  }}
                  className="p-3 rounded-2xl bg-linear-to-br from-calm-purple-500 via-calm-blue-500 to-emerald-500 shadow-2xl"
                >
                  <HistoryIcon className="w-7 h-7 text-white" />
                </motion.div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-calm-purple-600 via-calm-blue-600 to-emerald-600 bg-clip-text text-transparent">
                    Memory Lane
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Your emotional journey, beautifully preserved
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <motion.button
                onClick={toggleViewMode}
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 rounded-xl bg-white/80 dark:bg-purple-800/80 backdrop-blur-sm border border-calm-purple-200 dark:border-dark-purple-700 hover:border-calm-purple-300 dark:hover:border-dark-purple-600 shadow-lg hover:shadow-xl transition-all duration-300"
                aria-label={`Switch to ${viewMode === 'grid' ? 'list' : 'grid'} view`}
              >
                {viewMode === 'grid' ? (
                  <List className="w-5 h-5 text-calm-purple-600 dark:text-calm-purple-400" />
                ) : (
                  <Grid className="w-5 h-5 text-calm-purple-600 dark:text-calm-purple-400" />
                )}
              </motion.button>
              <motion.button
                onClick={() => setShowStats(!showStats)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 rounded-xl bg-white/80 dark:bg-purple-800/80 backdrop-blur-sm border border-calm-purple-200 dark:border-dark-purple-700 hover:border-calm-purple-300 dark:hover:border-dark-purple-600 shadow-lg hover:shadow-xl transition-all duration-300"
                aria-label={showStats ? "Hide stats" : "Show stats"}
              >
                {showStats ? (
                  <ChevronUp className="w-5 h-5 text-calm-purple-600 dark:text-calm-purple-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-calm-purple-600 dark:text-calm-purple-400" />
                )}
              </motion.button>
            </div>
          </div>

          {/* Tabs */}
          <motion.div 
            className="flex flex-wrap gap-2 mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {['all', 'favorites', 'recent'].map((tab) => (
              <motion.button
                key={tab}
                variants={tabVariants}
                initial="rest"
                whileHover="hover"
                whileTap="pressed"
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${
                  activeTab === tab
                    ? 'bg-linear-to-r from-calm-purple-500 to-calm-blue-500 text-white shadow-lg'
                    : 'bg-white/70 dark:bg-purple-800/70 text-gray-700 dark:text-gray-300 hover:bg-calm-purple-100 dark:hover:bg-purple-700'
                }`}
              >
                {tab === 'favorites' && <Heart className="w-4 h-4" />}
                {tab === 'recent' && <Zap className="w-4 h-4" />}
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {tab === 'favorites' && totalFavorites > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-white/30">
                    {totalFavorites}
                  </span>
                )}
              </motion.button>
            ))}
          </motion.div>

          {/* Stats Cards - Animated */}
          <AnimatePresence>
            {showStats && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 overflow-hidden"
              >
                {[
                  { 
                    label: 'Total Memories', 
                    value: totalTranslations, 
                    icon: <BookOpen className="w-5 h-5" />,
                    color: 'from-calm-purple-500 to-calm-blue-500'
                  },
                  { 
                    label: 'Favorites', 
                    value: totalFavorites, 
                    icon: <Heart className="w-5 h-5" />,
                    color: 'from-rose-500 to-pink-500'
                  },
                  { 
                    label: 'Unique Emotions', 
                    value: totalEmotions, 
                    icon: <Palette className="w-5 h-5" />,
                    color: 'from-emerald-500 to-green-500'
                  },
                  { 
                    label: 'Most Felt', 
                    value: mostCommonEmotion, 
                    icon: <TrendingUp className="w-5 h-5" />,
                    color: 'from-amber-500 to-orange-500',
                    isText: true
                  },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    custom={index}
                    variants={statsVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover={{ y: -5, scale: 1.02 }}
                    className={`bg-white/80 dark:bg-purple-800/80 backdrop-blur-sm rounded-2xl p-4 border border-calm-purple-200 dark:border-dark-purple-700 shadow-lg hover:shadow-xl transition-all duration-300`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-2 rounded-lg bg-linear-to-r ${stat.color} bg-opacity-10`}>
                        <div className={`text-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                          {stat.icon}
                        </div>
                      </div>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="w-6 h-6 opacity-20"
                      >
                        <Sparkles className="w-full h-full" />
                      </motion.div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
                    <p className={`text-2xl font-bold ${
                      stat.isText 
                        ? 'text-gray-800 dark:text-gray-200 capitalize' 
                        : `bg-linear-to-r ${stat.color} bg-clip-text text-transparent`
                    }`}>
                      {stat.value}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Search & Filter Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/80 dark:bg-purple-800/80 backdrop-blur-sm rounded-2xl p-6 border border-calm-purple-200 dark:border-dark-purple-700 shadow-lg mb-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Search className="w-4 h-4" />
                  Search your memories
                  <motion.span
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-xs text-gray-500"
                  >
                    (try searching by feeling or situation)
                  </motion.span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by text, emotion, or situation..."
                    className="w-full p-4 rounded-xl border border-calm-purple-200 dark:border-dark-purple-700 bg-white dark:bg-purple-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:border-calm-purple-500 dark:focus:border-calm-purple-400 shadow-inner pl-12"
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <Search className="w-5 h-5 text-calm-purple-400" />
                  </div>
                  {searchTerm && (
                    <motion.button
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      onClick={() => setSearchTerm('')}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-purple-700"
                    >
                      <Trash2 className="w-4 h-4 text-gray-400" />
                    </motion.button>
                  )}
                </div>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Filter className="w-4 h-4" />
                  Filter by emotion
                  <span className="text-xs text-gray-500">
                    ({allEmotions.length} emotions)
                  </span>
                </label>
                <div className="relative">
                  <select
                    value={selectedEmotion}
                    onChange={(e) => setSelectedEmotion(e.target.value)}
                    className="w-full p-4 rounded-xl border border-calm-purple-200 dark:border-dark-purple-700 bg-white dark:bg-purple-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:border-calm-purple-500 dark:focus:border-calm-purple-400 appearance-none shadow-inner"
                  >
                    <option value="all">🌈 All Emotions</option>
                    {allEmotions.map(emotion => (
                      <option key={emotion} value={emotion}>
                        {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <ChevronDown className="w-5 h-5 text-calm-purple-400" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <motion.div 
              className="flex flex-wrap gap-3 mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <motion.button
                onClick={loadHistory}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-calm-blue-100 dark:bg-purple-800 text-calm-blue-700 dark:text-calm-blue-300 hover:bg-calm-blue-200 dark:hover:bg-purple-700 transition-colors shadow-lg"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh Memories
              </motion.button>
              {translations.length > 0 && (
                <>
                  <motion.button
                    onClick={handleDeleteAll}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 hover:bg-rose-200 dark:hover:bg-rose-900/50 transition-colors shadow-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear All
                  </motion.button>
                  <motion.button
                    onClick={() => {
                      const text = translations.map(t => 
                        `"${t.rawText}" → "${t.clearExpression}"`
                      ).join('\n\n');
                      navigator.clipboard.writeText(text);
                      createHeartEffect();
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors shadow-lg"
                  >
                    <Copy className="w-4 h-4" />
                    Export All
                  </motion.button>
                </>
              )}
            </motion.div>
          </motion.div>
        </motion.header>

        {/* Main Content */}
        <motion.main
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative"
        >
          {/* Loading State */}
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-16 absolute inset-0 bg-gradient-light/50 dark:bg-gradient-dark/50 backdrop-blur-sm z-30"
              >
                <div className="inline-block relative">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 rounded-full border-4 border-calm-purple-500 border-t-transparent"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <BookOpen className="w-8 h-8 text-calm-purple-500" />
                  </motion.div>
                </div>
                <motion.p
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="mt-6 text-lg text-gray-600 dark:text-gray-400"
                >
                  Unpacking your emotional memories...
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error State */}
          {error && !loading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <div className="relative inline-block mb-6">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 w-24 h-24 rounded-full border-2 border-rose-200 dark:border-rose-800"
                />
                <div className="p-4 rounded-2xl bg-rose-100 dark:bg-rose-900/30 w-20 h-20 flex items-center justify-center mx-auto">
                  <Trash2 className="w-10 h-10 text-rose-600 dark:text-rose-400" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3">
                Memory Load Failed
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">{error}</p>
              <motion.button
                onClick={loadHistory}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 rounded-xl bg-linear-to-r from-calm-purple-500 to-calm-blue-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <RefreshCw className="inline w-5 h-5 mr-2" />
                Try Again
              </motion.button>
            </motion.div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredTranslations.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <motion.div
                animate={{ 
                  y: [0, -20, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="inline-block mb-6"
              >
                <div className="p-6 rounded-3xl bg-linear-to-br from-calm-blue-100 to-calm-purple-100 dark:from-dark-purple-800 dark:to-dark-purple-900 shadow-2xl">
                  <Calendar className="w-16 h-16 text-calm-blue-600 dark:text-calm-blue-400" />
                </div>
              </motion.div>
              <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                {searchTerm || selectedEmotion !== 'all' 
                  ? 'No memories match your search' 
                  : 'Your memory lane is empty'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                {searchTerm || selectedEmotion !== 'all' 
                  ? 'Try different keywords or clear filters to see all your emotional translations.'
                  : 'Start translating your feelings to create beautiful memories that you can revisit anytime.'}
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                {searchTerm || selectedEmotion !== 'all' ? (
                  <motion.button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedEmotion('all');
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 rounded-xl bg-calm-purple-100 dark:bg-purple-800 text-calm-purple-700 dark:text-calm-purple-300 hover:bg-calm-purple-200 dark:hover:bg-purple-700 transition-colors shadow-lg"
                  >
                    Clear Filters
                  </motion.button>
                ) : (
                  <motion.button
                    onClick={() => onNavigate('home')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 rounded-xl bg-linear-to-r from-calm-purple-500 to-calm-blue-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Create Your First Memory
                  </motion.button>
                )}
                <motion.button
                  onClick={() => {
                    setActiveTab('favorites');
                    createHeartEffect();
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 rounded-xl bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 hover:bg-rose-200 dark:hover:bg-rose-900/50 transition-colors shadow-lg"
                >
                  View Favorites
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Translation Cards Grid */}
          {!loading && !error && filteredTranslations.length > 0 && (
            <>
              {/* Results Header */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-between mb-6"
              >
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                    {activeTab === 'favorites' ? '💖 Favorite Memories' : 
                     activeTab === 'recent' ? '⚡ Recent Translations' : 
                     '📚 All Memories'}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Showing {filteredTranslations.length} of {translations.length} memories
                  </p>
                </div>
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="px-4 py-2 rounded-full bg-linear-to-r from-calm-purple-500/10 to-calm-blue-500/10"
                >
                  <span className="text-sm font-medium text-calm-purple-600 dark:text-calm-purple-400">
                    {viewMode === 'grid' ? 'Grid View' : 'List View'}
                  </span>
                </motion.div>
              </motion.div>

              {/* Cards Container */}
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                <AnimatePresence mode="popLayout">
                  {filteredTranslations.map((translation, index) => (
                    <motion.div
                      key={translation._id}
                      data-id={translation._id}
                      layout
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: -20 }}
                      transition={{ 
                        type: "spring",
                        stiffness: 100,
                        damping: 15,
                        delay: index * 0.05
                      }}
                      whileHover={{ 
                        y: -8,
                        transition: { duration: 0.2 }
                      }}
                    >
                      <HistoryCard
                        translation={translation}
                        index={index}
                        onCopy={(text) => handleCopy(text, translation._id)}
                        onDelete={handleDelete}
                        isFavorite={favorites.includes(translation._id)}
                        onToggleFavorite={() => toggleFavorite(translation._id)}
                        viewMode={viewMode}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Load More / Back to Top */}
              {filteredTranslations.length > 6 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-center mt-12"
                >
                  <motion.button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 rounded-xl bg-linear-to-r from-calm-purple-500/10 to-calm-blue-500/10 text-calm-purple-600 dark:text-calm-purple-400 hover:from-calm-purple-500/20 hover:to-calm-blue-500/20 transition-all duration-300 shadow-lg"
                  >
                    Back to Top
                  </motion.button>
                </motion.div>
              )}
            </>
          )}
        </motion.main>
      </div>

      {/* Copy Toast */}
      <AnimatePresence>
        {copiedId && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.8 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-linear-to-r from-emerald-500 to-green-500 text-white shadow-2xl">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <Check className="w-5 h-5" />
              </motion.div>
              <span className="font-medium">Copied to clipboard!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      
    </div>
  );
};

export default History;