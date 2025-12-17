import React, { useState } from 'react'; // FIX: Add useEffect import
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Copy, Trash2, ChevronRight, Eye, Share2, Heart, Star, Sparkles } from 'lucide-react';

const HistoryCard = ({ translation, onCopy,  onNotify, onDelete, index, onExpand, isFavorite, onToggleFavorite }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return `Today, ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays === 1) {
      return `Yesterday, ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const handleCopy = async () => {
    const text = `Clear Expression: "${translation.clearExpression || translation.text}"\nRespectful Expression: "${translation.respectfulExpression || translation.alternative}"\nEmotions: ${(translation.emotions || translation.emotionTags || []).join(', ')}\nValidation: "${translation.validation || translation.feedback || 'Your feelings are valid.'}"`;
    
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      onCopy && onCopy('Translation copied to clipboard!');
    } catch (err) {
      onCopy && onCopy('Failed to copy to clipboard');
    }
  };

  const handleDelete = () => {
    if (showDeleteConfirm) {
      onDelete && onDelete(translation._id || translation.id);
    } else {
      setShowDeleteConfirm(true);
      setTimeout(() => setShowDeleteConfirm(false), 3000);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: 'My Emotional Translation',
      text: `"${translation.rawText || translation.original || translation.text}" → "${translation.clearExpression || translation.text}"`,
      url: window.location.href,
    };
    
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.text);
        onCopy && onCopy('Shared content copied to clipboard!');
      }
    } catch (err) {
      console.log('Share cancelled or failed');
    }
  };

  // FIX: Add this function - you were missing it
   const handleStarClick = () => {
    if (onToggleFavorite) {
      onToggleFavorite();
    }
    
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    onExpand && onExpand(!isExpanded ? translation : null);
  };

  const containerVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9,
      rotateX: -15
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        delay: index * 0.07,
        duration: 0.6,
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    },
    exit: { 
      opacity: 0, 
      x: 100,
      rotateZ: -5,
      transition: { duration: 0.3 }
    },
    hover: {
      y: -8,
      scale: 1.02,
      boxShadow: "0 20px 40px rgba(139, 92, 246, 0.15)",
      transition: { duration: 0.3 }
    }
  };

  const cardBackgroundVariants = {
    initial: { backgroundPosition: "0% 0%" },
    hover: { 
      backgroundPosition: "100% 100%",
      transition: { duration: 2, repeat: Infinity, ease: "linear" }
    }
  };

  const floatingIconVariants = {
    float: {
      y: [0, -10, 0],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const emotionBubbleVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: (i) => ({
      scale: 1,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        type: "spring",
        stiffness: 200,
        damping: 12
      }
    }),
    hover: { scale: 1.1, rotate: 5 }
  };

  const buttonVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.2, rotate: 5 },
    tap: { scale: 0.9 }
  };

  const expandContentVariants = {
    collapsed: { height: 0, opacity: 0 },
    expanded: { 
      height: "auto", 
      opacity: 1,
      transition: {
        height: { duration: 0.4, ease: "easeInOut" },
        opacity: { duration: 0.3, delay: 0.1 }
      }
    }
  };

  const emotions = translation.emotions || translation.emotionTags || ['emotional'];
  const rawText = translation.rawText || translation.original || translation.text || 'No text available';
  const clearExpression = translation.clearExpression || translation.text || 'Clear expression not available';
  const respectfulExpression = translation.respectfulExpression || translation.alternative || 'Respectful expression not available';
  const validation = translation.validation || translation.feedback || 'Your feelings are acknowledged.';

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      whileHover="hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative overflow-hidden"
      style={{ perspective: 1000 }}
    >
      {/* Animated Background Gradient */}
      <motion.div
        variants={cardBackgroundVariants}
        className="absolute inset-0 bg-linear-to-br from-calm-purple-50/50 via-white to-calm-blue-50/50 dark:from-purple-900/30 dark:via-purple-800 dark:to-purple-900/30 opacity-0 group-hover:opacity-100"
        style={{ backgroundSize: '200% 200%' }}
      />
      
      {/* Floating Sparkles on Hover */}
      <AnimatePresence>
        {isHovered && (
          <>
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0, x: Math.random() * 100 - 50, y: Math.random() * 100 - 50 }}
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  x: [0, Math.random() * 40 - 20],
                  y: [0, Math.random() * 40 - 20]
                }}
                transition={{ 
                  duration: 1.5,
                  delay: i * 0.2,
                  repeat: Infinity,
                  repeatDelay: 2
                }}
                className="absolute pointer-events-none"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
              >
                <Sparkles className="w-3 h-3 text-calm-purple-200/50" />
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>

      <div className="relative bg-white/80 dark:bg-purple-800/80 backdrop-blur-sm rounded-2xl border border-calm-purple-200/50 dark:border-dark-purple-700/50 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden">
        <div className="p-6 space-y-4">
          {/* Header with Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                variants={floatingIconVariants}
                animate="float"
                className="p-2 rounded-xl bg-linear-to-br from-calm-blue-500 to-calm-purple-500 shadow-lg"
              >
                <Clock className="w-5 h-5 text-white" />
              </motion.div>
              <div>
                <motion.span 
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                >
                  {formatDate(translation.timestamp || new Date().toISOString())}
                </motion.span>
                <motion.div 
                  className="h-1 w-8 bg-linear-to-r from-calm-blue-500 to-calm-purple-500 rounded-full mt-1"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Like Button */}
              <motion.button
                variants={buttonVariants}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
                onClick={() => setIsLiked(!isLiked)}
                className={`p-2 rounded-xl transition-colors ${isLiked ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400' : 'hover:bg-gray-100 dark:hover:bg-purple-700 text-gray-500 dark:text-gray-400'}`}
                aria-label={isLiked ? "Unlike" : "Like"}
              >
                <Heart className="w-4 h-4" fill={isLiked ? "currentColor" : "none"} />
              </motion.button>

              {/* Favorites Button - Use isFavorite prop */}
              <motion.button
                variants={buttonVariants}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
                onClick={handleStarClick}
                className={`p-2 rounded-xl transition-colors ${isFavorite ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' : 'hover:bg-gray-100 dark:hover:bg-purple-700 text-gray-500 dark:text-gray-400'}`}
                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                <Star className="w-4 h-4" fill={isFavorite ? "currentColor" : "none"} />
              </motion.button>

              {/* Share Button */}
              <motion.button
                variants={buttonVariants}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
                onClick={handleShare}
                className="p-2 rounded-xl hover:bg-calm-blue-50 dark:hover:bg-purple-700 text-gray-500 dark:text-gray-400 hover:text-calm-blue-600 dark:hover:text-calm-blue-400 transition-colors"
                aria-label="Share"
              >
                <Share2 className="w-4 h-4" />
              </motion.button>

              {/* Copy Button with Feedback */}
              <motion.button
                variants={buttonVariants}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
                onClick={handleCopy}
                className={`p-2 rounded-xl transition-colors ${isCopied ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'hover:bg-gray-100 dark:hover:bg-purple-700 text-gray-500 dark:text-gray-400'}`}
                aria-label="Copy translation"
              >
                <AnimatePresence mode="wait">
                  {isCopied ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 180 }}
                    >
                      <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                        <div className="w-1.5 h-1 border-b-2 border-r-2 border-white rotate-45 -translate-y-0.5" />
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="copy"
                      initial={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <Copy className="w-4 h-4" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Delete Button with Confirmation */}
              <motion.div className="relative">
                <motion.button
                  variants={buttonVariants}
                  initial="rest"
                  whileHover="hover"
                  whileTap="tap"
                  onClick={handleDelete}
                  className={`p-2 rounded-xl transition-colors ${showDeleteConfirm ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400' : 'hover:bg-rose-50 dark:hover:bg-rose-900/20 text-gray-500 dark:text-gray-400 hover:text-rose-600 dark:hover:text-rose-400'}`}
                  aria-label="Delete translation"
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
                
                <AnimatePresence>
                  {showDeleteConfirm && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute right-0 top-full mt-2 p-2 bg-rose-100 dark:bg-rose-900 rounded-lg shadow-lg z-10 whitespace-nowrap"
                    >
                      <span className="text-xs font-medium text-rose-700 dark:text-rose-300">
                        Click again to confirm
                      </span>
                      <div className="absolute -top-1 right-3 w-2 h-2 bg-rose-100 dark:bg-rose-900 rotate-45" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>

          {/* Original Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.4 }}
            className="space-y-2"
          >
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Original Feeling
            </p>
            <p className="text-gray-800 dark:text-gray-200 italic bg-gray-50 dark:bg-purple-700/50 rounded-lg p-3 border border-gray-200 dark:border-dark-purple-600">
              "{rawText}"
            </p>
          </motion.div>

          {/* Emotions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.5 }}
            className="space-y-2"
          >
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Detected Emotions
            </p>
            <div className="flex flex-wrap gap-2">
              {emotions.map((emotion, idx) => (
                <motion.span
                  key={idx}
                  custom={idx}
                  variants={emotionBubbleVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  className="px-3 py-1.5 text-sm rounded-full bg-linear-to-r from-calm-purple-100 to-calm-blue-100 dark:from-dark-purple-700 dark:to-dark-purple-600 text-calm-purple-700 dark:text-calm-purple-300 font-medium shadow-sm hover:shadow-md transition-shadow"
                >
                  {emotion}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Expand/Collapse Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.6 }}
            className="pt-2"
          >
            <motion.button
              onClick={toggleExpand}
              className="w-full flex items-center justify-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-purple-700 text-gray-600 dark:text-gray-400 hover:text-calm-purple-600 dark:hover:text-calm-purple-400 transition-colors group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-sm font-medium">
                {isExpanded ? 'Show Less' : 'View Translation'}
              </span>
              <motion.div
                animate={{ rotate: isExpanded ? 90 : 0 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <ChevronRight className="w-4 h-4" />
              </motion.div>
            </motion.button>
          </motion.div>

          {/* Expandable Content */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                variants={expandContentVariants}
                initial="collapsed"
                animate="expanded"
                exit="collapsed"
                className="space-y-4 overflow-hidden"
              >
                {/* Clear Expression */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-calm-blue-500" />
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Clear Expression
                    </p>
                  </div>
                  <p className="text-gray-800 dark:text-gray-200 bg-calm-blue-50/50 dark:bg-purple-700/30 rounded-lg p-3 border border-calm-blue-200 dark:border-dark-purple-600">
                    {clearExpression}
                  </p>
                </motion.div>

                {/* Respectful Expression */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-calm-purple-500" />
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Respectful Expression
                    </p>
                  </div>
                  <p className="text-gray-800 dark:text-gray-200 bg-calm-purple-50/50 dark:bg-purple-700/30 rounded-lg p-3 border border-calm-purple-200 dark:border-dark-purple-600">
                    {respectfulExpression}
                  </p>
                </motion.div>

                {/* Validation */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Validation
                    </p>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 italic bg-emerald-50/50 dark:bg-emerald-900/10 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800/30">
                    "{validation}"
                  </p>
                </motion.div>

                {/* View Eye Icon */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex justify-center pt-2"
                >
                  <Eye className="w-5 h-5 text-calm-purple-400 dark:text-calm-purple-500" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Progress Indicator */}
          <motion.div 
            className="h-1 bg-linear-to-r from-calm-blue-500 via-calm-purple-500 to-emerald-500 rounded-full overflow-hidden"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: index * 0.1 + 0.7, duration: 1, ease: "easeOut" }}
          >
            <motion.div
              className="h-full w-full bg-white/30"
              animate={{ 
                x: ["-100%", "100%"]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default HistoryCard;