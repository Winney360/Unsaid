import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, Sparkles } from 'lucide-react';

const EmotionInput = ({ onTranslate, isLoading }) => {
  const [text, setText] = useState('');
  const [characterCount, setCharacterCount] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() && !isLoading) {
      onTranslate(text);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value.length <= 500) {
      setText(value);
      setCharacterCount(value.length);
    }
  };

  const examples = [
    "I can't stand this anymore, everything feels so overwhelming",
    "Why does nobody understand how I feel?",
    "I'm so tired of pretending to be okay",
    "I feel lost and don't know what to do",
    "Everything seems pointless right now"
  ];

  const handleExampleClick = (example) => {
    setText(example);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <label htmlFor="emotion-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Enter your raw emotional text
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
              (Your words are safe here)
            </span>
          </label>
          
          <motion.textarea
            id="emotion-input"
            value={text}
            onChange={handleInputChange}
            placeholder="Type how you're feeling... no filters needed"
            className="w-full h-40 p-4 text-lg border-2 border-calm-purple-200 dark:border-dark-purple-600 rounded-xl bg-white dark:bg-dark-purple-900 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 resize-none focus:outline-none focus:border-calm-purple-500 dark:focus:border-calm-purple-400 focus:ring-2 focus:ring-calm-purple-200 dark:focus:ring-calm-purple-800 transition-all duration-300 shadow-sm hover:shadow-md"
            disabled={isLoading}
            whileFocus={{ scale: 1.005 }}
          />
          
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {characterCount}/500 characters
            </span>
            <AnimatePresence>
              {characterCount > 0 && (
                <motion.button
                  type="button"
                  onClick={() => setText('')}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-xs text-calm-purple-600 dark:text-calm-purple-400 hover:text-calm-purple-800 dark:hover:text-calm-purple-300 transition-colors"
                >
                  Clear
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Example Texts */}
        <div className="space-y-2">
          <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
            <Sparkles className="w-4 h-4" />
            Try an example:
          </p>
          <div className="flex flex-wrap gap-2">
            {examples.map((example, index) => (
              <motion.button
                key={index}
                type="button"
                onClick={() => handleExampleClick(example)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-1.5 text-sm bg-calm-blue-50 dark:bg-dark-purple-800 text-calm-blue-700 dark:text-calm-blue-300 rounded-lg border border-calm-blue-200 dark:border-dark-purple-700 hover:bg-calm-blue-100 dark:hover:bg-dark-purple-700 transition-all duration-300"
                disabled={isLoading}
              >
                {example.substring(0, 40)}...
              </motion.button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={!text.trim() || isLoading}
          className={`w-full py-3 px-6 rounded-xl font-medium text-lg flex items-center justify-center gap-2 transition-all duration-300 ${
            text.trim() && !isLoading
              ? 'bg-linear-to-r from-calm-purple-500 to-calm-blue-500 hover:from-calm-purple-600 hover:to-calm-blue-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
          }`}
          whileTap={{ scale: 0.98 }}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Translating...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Translate Emotion
            </>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default EmotionInput;