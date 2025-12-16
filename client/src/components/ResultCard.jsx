import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, MessageSquare, Heart, Shield } from 'lucide-react';
import EmotionTags from './EmotionTags';

const ResultCard = ({ translation }) => {
  if (!translation) return null;

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-2xl mx-auto space-y-6"
    >
      {/* Clear Expression */}
      <motion.div
        variants={itemVariants}
        className="bg-linear-to-br from-calm-blue-50 to-calm-purple-50 dark:from-dark-purple-900 dark:to-dark-purple-800 rounded-xl p-6 border border-calm-blue-200 dark:border-dark-purple-700 shadow-lg"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-calm-blue-100 dark:bg-dark-purple-700">
            <MessageSquare className="w-5 h-5 text-calm-blue-600 dark:text-calm-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Clear Expression
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Honest and emotionally neutral
            </p>
          </div>
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed p-4 bg-white/50 dark:bg-black/20 rounded-lg"
        >
          "{translation.clearExpression}"
        </motion.p>
      </motion.div>

      {/* Respectful Expression */}
      <motion.div
        variants={itemVariants}
        className="bg-linear-to-br from-calm-purple-50 to-pink-50 dark:from-dark-purple-900 dark:to-pink-900/20 rounded-xl p-6 border border-calm-purple-200 dark:border-dark-purple-700 shadow-lg"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-calm-purple-100 dark:bg-dark-purple-700">
            <Shield className="w-5 h-5 text-calm-purple-600 dark:text-calm-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Respectful Expression
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Non-confrontational and safe for communication
            </p>
          </div>
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed p-4 bg-white/50 dark:bg-black/20 rounded-lg"
        >
          "{translation.respectfulExpression}"
        </motion.p>
      </motion.div>

      {/* Detected Emotions */}
      <motion.div
        variants={itemVariants}
        className="bg-linear-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-6 border border-amber-200 dark:border-amber-800/30 shadow-lg"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
            <Heart className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Detected Emotions
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Simple emotion words identified
            </p>
          </div>
        </div>
        <EmotionTags emotions={translation.emotions} />
      </motion.div>

      {/* Validation Message */}
      <motion.div
        variants={itemVariants}
        className="bg-linear-to-br from-green-50 to-emerald-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-xl p-6 border border-green-200 dark:border-emerald-800/30 shadow-lg"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-green-100 dark:bg-emerald-900/30">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-emerald-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Validation
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your feelings are acknowledged
            </p>
          </div>
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-700 dark:text-gray-300 text-xl italic text-center p-4"
        >
          "{translation.validation}"
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default ResultCard;