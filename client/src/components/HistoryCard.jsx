import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Copy, Trash2, ChevronRight } from 'lucide-react';

const HistoryCard = ({ translation, onCopy, onDelete, index }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const containerVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        delay: index * 0.1,
        duration: 0.4
      }
    },
    exit: { opacity: 0, x: 50, transition: { duration: 0.2 } }
  };

  const handleCopy = () => {
    const text = `Clear Expression: "${translation.clearExpression}"\nRespectful Expression: "${translation.respectfulExpression}"\nEmotions: ${translation.emotions.join(', ')}\nValidation: "${translation.validation}"`;
    onCopy(text);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="group bg-white dark:bg-dark-purple-800 rounded-xl border border-calm-purple-200 dark:border-dark-purple-700 hover:border-calm-purple-300 dark:hover:border-dark-purple-600 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
    >
      <div className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-calm-blue-100 dark:bg-dark-purple-700 group-hover:bg-calm-blue-200 dark:group-hover:bg-dark-purple-600 transition-colors">
              <Clock className="w-4 h-4 text-calm-blue-600 dark:text-calm-blue-400" />
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {formatDate(translation.timestamp)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              onClick={handleCopy}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-lg hover:bg-calm-blue-50 dark:hover:bg-dark-purple-700 text-gray-500 dark:text-gray-400 hover:text-calm-blue-600 dark:hover:text-calm-blue-400 transition-colors"
              aria-label="Copy translation"
            >
              <Copy className="w-4 h-4" />
            </motion.button>
            <motion.button
              onClick={() => onDelete(translation._id)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/30 text-gray-500 dark:text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
              aria-label="Delete translation"
            >
              <Trash2 className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        {/* Original Text Preview */}
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Original</p>
          <p className="text-gray-800 dark:text-gray-200 line-clamp-2 italic">
            "{translation.rawText}"
          </p>
        </div>

        {/* Clear Expression Preview */}
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Clear Expression</p>
          <p className="text-gray-800 dark:text-gray-200 line-clamp-2">
            {translation.clearExpression}
          </p>
        </div>

        {/* Emotions */}
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Emotions</p>
          <div className="flex flex-wrap gap-2">
            {translation.emotions.slice(0, 3).map((emotion, idx) => (
              <span
                key={idx}
                className="px-2 py-1 text-xs rounded-full bg-calm-purple-100 dark:bg-dark-purple-700 text-calm-purple-700 dark:text-calm-purple-300"
              >
                {emotion}
              </span>
            ))}
            {translation.emotions.length > 3 && (
              <span className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                +{translation.emotions.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Validation Preview */}
        <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Validation</p>
          <p className="text-gray-700 dark:text-gray-300 italic text-sm line-clamp-1">
            "{translation.validation}"
          </p>
        </div>

        {/* View More Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center pt-2"
        >
          <ChevronRight className="w-5 h-5 text-calm-purple-400 dark:text-calm-purple-500 transform group-hover:translate-x-1 transition-transform" />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default HistoryCard;