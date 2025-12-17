import React from 'react';
import { motion } from 'framer-motion';

const emotionColors = {
  // Calm/Positive
  calm: 'bg-calm-blue-100 text-calm-blue-800 dark:bg-calm-blue-900/30 dark:text-calm-blue-300',
  peace: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
  happiness: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  hope: 'bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300',
  love: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
  
  // Neutral/Complex
  confusion: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  tiredness: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
  uncertainty: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
  
  // Challenging
  sadness: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  anger: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  frustration: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  loneliness: 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300',
  disappointment: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  fear: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300',
  overwhelm: 'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/30 dark:text-fuchsia-300',
  
  // Default
  default: 'bg-calm-purple-100 text-calm-purple-800 dark:bg-purple-800 dark:text-calm-purple-300'
};

const EmotionTags = ({ emotions }) => {
  if (!emotions || !Array.isArray(emotions)) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const tagVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      y: 20 
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    },
    hover: {
      scale: 1.1,
      rotate: [0, -2, 2, -2, 0],
      transition: {
        rotate: {
          repeat: Infinity,
          duration: 0.5
        }
      }
    }
  };

  const getEmotionColor = (emotion) => {
    const normalizedEmotion = emotion.toLowerCase();
    for (const [key, value] of Object.entries(emotionColors)) {
      if (normalizedEmotion.includes(key)) {
        return value;
      }
    }
    return emotionColors.default;
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-wrap gap-3"
    >
      {emotions.map((emotion, index) => (
        <motion.div
          key={`${emotion}-${index}`}
          variants={tagVariants}
          whileHover="hover"
          className={`px-4 py-2 rounded-full font-medium text-sm border ${getEmotionColor(emotion)} border-opacity-30 dark:border-opacity-30 shadow-sm`}
        >
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-current opacity-70" />
            {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default EmotionTags;