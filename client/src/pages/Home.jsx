import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Shield, 
  MessageSquare, 
  Heart,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import EmotionInput from '../components/EmotionInput';
import ResultCard from '../components/ResultCard';
import Disclaimer from '../components/Disclaimer';
import { translateEmotion } from '../services/api';

const Home = ({ onNavigate }) => {
  const [translation, setTranslation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [error, setError] = useState(null);
  const [sessionId] = useState(() => 
    localStorage.getItem('unsaid-session-id') || `session_${Date.now()}`
  );

  React.useEffect(() => {
    localStorage.setItem('unsaid-session-id', sessionId);
  }, [sessionId]);

  const handleTranslate = async (text) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await translateEmotion(text, sessionId);
      if (result.success) {
        setTranslation(result.translation);
      } else {
        setError(result.error || 'Translation failed');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
      console.error('Translation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setTranslation(null);
    setError(null);
  };

  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI-Powered Translation",
      description: "Advanced AI understands and translates complex emotions",
      color: "from-calm-purple-500 to-purple-600"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Emotionally Safe",
      description: "Always respectful, never judgmental",
      color: "from-calm-blue-500 to-blue-600"
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Clear Communication",
      description: "Turn messy feelings into clear expressions",
      color: "from-emerald-500 to-green-600"
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Privacy First",
      description: "Your emotions stay between you and the AI",
      color: "from-rose-500 to-pink-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-light dark:bg-gradient-dark transition-all duration-500">
      <AnimatePresence>
        {showDisclaimer && (
          <Disclaimer onClose={() => setShowDisclaimer(false)} />
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 10, 0],
                scale: [1, 1.1, 1, 1.1, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3
              }}
              className="p-3 rounded-2xl bg-linear-to-r from-calm-purple-500 to-calm-blue-500 shadow-lg"
            >
              <Sparkles className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-5xl font-bold bg-linear-to-r from-calm-purple-600 to-calm-blue-600 bg-clip-text text-transparent">
              UNSAID
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6">
            An emotional translation engine that helps express difficult feelings in clear, respectful language
          </p>
          <motion.button
            onClick={() => setShowDisclaimer(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-full bg-calm-blue-100 dark:bg-dark-purple-800 text-calm-blue-700 dark:text-calm-blue-300 hover:bg-calm-blue-200 dark:hover:bg-dark-purple-700 transition-colors"
          >
            <Shield className="w-4 h-4" />
            Important Safety Information
          </motion.button>
        </motion.header>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ y: -5 }}
              className="bg-white/70 dark:bg-dark-purple-800/70 backdrop-blur-sm rounded-xl p-5 border border-calm-purple-200 dark:border-dark-purple-700 hover:border-calm-purple-300 dark:hover:border-dark-purple-600 shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div className={`p-3 rounded-lg bg-linear-to-r ${feature.color} w-fit mb-4`}>
                <div className="text-white">
                  {feature.icon}
                </div>
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content */}
        <div className="space-y-12">
          {/* Input Section */}
          <section>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mb-8 text-center"
            >
              <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-3">
                Express Your Emotions
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Type how you're feeling—raw, unfiltered, messy. We'll help translate it into clear, respectful language.
              </p>
            </motion.div>
            <EmotionInput 
              onTranslate={handleTranslate} 
              isLoading={isLoading}
            />
          </section>

          {/* Result Section */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800 rounded-xl p-4"
              >
                <p className="text-rose-700 dark:text-rose-300">
                  {error}
                </p>
              </motion.div>
            )}

            {translation && (
              <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                    Translation Results
                  </h2>
                  <div className="flex items-center gap-3">
                    <motion.button
                      onClick={() => onNavigate('history')}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-calm-purple-100 dark:bg-dark-purple-800 text-calm-purple-700 dark:text-calm-purple-300 hover:bg-calm-purple-200 dark:hover:bg-dark-purple-700 transition-colors"
                    >
                      View History
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      onClick={handleClear}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      Clear
                    </motion.button>
                  </div>
                </div>
                <ResultCard translation={translation} />
              </motion.section>
            )}
          </AnimatePresence>

          {/* Empty State */}
          {!translation && !isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="max-w-md mx-auto space-y-4">
                <div className="p-4 rounded-full bg-calm-blue-100 dark:bg-dark-purple-800 w-fit mx-auto">
                  <MessageSquare className="w-8 h-8 text-calm-blue-600 dark:text-calm-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                  Your translation will appear here
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Type your emotions above and click "Translate Emotion" to see the magic happen
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;