import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, MessageSquare, Heart, Shield, Sparkles, Zap, Brain } from 'lucide-react';
import EmotionTags from './EmotionTags';

const ResultCard = ({ translation }) => {
  const [displayedTexts, setDisplayedTexts] = useState({});
  const [glowEffect, setGlowEffect] = useState(false);

  useEffect(() => {
    if (!translation) return;

    // Reset displayed texts when new translation arrives
    setDisplayedTexts({});
    
    // Trigger initial glow effect
    setGlowEffect(true);
    const timer = setTimeout(() => setGlowEffect(false), 1000);

    // Animate text appearance
    const fields = ['clearExpression', 'respectfulExpression', 'emotions', 'validation'];
    fields.forEach((field, index) => {
      setTimeout(() => {
        setDisplayedTexts(prev => ({ ...prev, [field]: true }));
      }, 300 * (index + 1));
    });

    return () => clearTimeout(timer);
  }, [translation]);

  if (!translation) return null;

  // Handle different response structures from Gemini
  const getClearExpression = () => {
    if (typeof translation === 'string') return translation;
    if (translation.clearExpression) return translation.clearExpression;
    if (translation.text) return translation.text;
    if (translation.content) return translation.content;
    return "I feel emotional about this situation.";
  };

  const getRespectfulExpression = () => {
    if (translation.respectfulExpression) return translation.respectfulExpression;
    if (translation.alternative) return translation.alternative;
    if (translation.suggestion) return translation.suggestion;
    return "I'm expressing my feelings in a way that maintains respect for everyone involved.";
  };

  const getEmotions = () => {
    if (Array.isArray(translation.emotions)) return translation.emotions;
    if (translation.emotionTags) return translation.emotionTags;
    if (typeof translation.emotions === 'string') return [translation.emotions];
    return ['emotional', 'expressive'];
  };

  const getValidation = () => {
    if (translation.validation) return translation.validation;
    if (translation.feedback) return translation.feedback;
    if (translation.confirmation) return translation.confirmation;
    return "Your feelings are valid and deserve to be heard respectfully.";
  };

  const clearExpression = getClearExpression();
  const respectfulExpression = getRespectfulExpression();
  const emotions = getEmotions();
  const validation = getValidation();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    },
    hover: {
      y: -5,
      boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
    }
  };

  const textVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const floatingVariants = {
    float: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: { 
      scale: 1, 
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-2xl mx-auto space-y-6 relative"
    >
      {/* Glow effect */}
      <AnimatePresence>
        {glowEffect && (
          <motion.div
            initial={{ opacity: 0.5, scale: 0.8 }}
            animate={{ opacity: 0, scale: 1.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 rounded-3xl bg-linear-to-r from-calm-purple-500/10 to-calm-blue-500/10 blur-xl pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        variants={cardVariants}
        className="text-center mb-6"
      >
        <motion.div
          variants={iconVariants}
          className="inline-flex items-center justify-center gap-3 mb-4"
        >
          <motion.div
            variants={floatingVariants}
            animate="float"
            className="p-3 rounded-2xl bg-linear-to-r from-calm-purple-500 to-calm-blue-500 shadow-lg"
          >
            <Brain className="w-7 h-7 text-white" />
          </motion.div>
          <div>
            <h2 className="text-2xl font-bold bg-linear-to-r from-calm-purple-600 to-calm-blue-600 bg-clip-text text-transparent">
              Translation Complete
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Your emotions have been translated
            </p>
          </div>
          <motion.div
            variants={floatingVariants}
            animate="float"
            className="p-3 rounded-2xl bg-linear-to-r from-emerald-500 to-green-500 shadow-lg"
          >
            <Sparkles className="w-7 h-7 text-white" />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Clear Expression */}
      <motion.div
        variants={cardVariants}
        whileHover="hover"
        className="relative overflow-hidden group"
      >
        {/* Animated border */}
        <motion.div
          className="absolute inset-0 bg-linear-to-r from-calm-blue-500 via-calm-purple-500 to-calm-blue-500 opacity-0 group-hover:opacity-20"
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{ backgroundSize: "200% 200%" }}
        />
        
        <div className="relative bg-linear-to-br from-calm-blue-50 to-calm-purple-50 dark:from-purple-900 dark:to-purple-800 rounded-xl p-6 border border-calm-blue-200 dark:border-purple-700 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <motion.div
              variants={iconVariants}
              className="p-2 rounded-lg bg-calm-blue-100 dark:bg-purple-700"
            >
              <MessageSquare className="w-5 h-5 text-calm-blue-600 dark:text-calm-blue-400" />
            </motion.div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Clear Expression
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Honest and emotionally neutral
              </p>
            </div>
          </div>
          <AnimatePresence>
            {displayedTexts.clearExpression && (
              <motion.div
                variants={textVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="relative"
              >
                {/* Text reveal effect */}
                <motion.div
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                  className="absolute inset-0 bg-linear-to-r from-calm-blue-50 to-transparent dark:from-purple-800"
                />
                <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed p-4 bg-white/50 dark:bg-black/20 rounded-lg">
                  "{clearExpression}"
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Respectful Expression */}
      <motion.div
        variants={cardVariants}
        whileHover="hover"
        className="relative overflow-hidden group"
      >
        <div className="relative bg-linear-to-br from-calm-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900/20 rounded-xl p-6 border border-calm-purple-200 dark:border-purple-700 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <motion.div
              variants={iconVariants}
              className="p-2 rounded-lg bg-calm-purple-100 dark:bg-purple-700"
            >
              <Shield className="w-5 h-5 text-calm-purple-600 dark:text-calm-purple-400" />
            </motion.div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Respectful Expression
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Non-confrontational and safe for communication
              </p>
            </div>
          </div>
          <AnimatePresence>
            {displayedTexts.respectfulExpression && (
              <motion.div
                variants={textVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="origin-left h-0.5 bg-linear-to-r from-calm-purple-500 to-pink-500 mb-3"
                />
                <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed p-4 bg-white/50 dark:bg-black/20 rounded-lg">
                  "{respectfulExpression}"
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Detected Emotions */}
      <motion.div
        variants={cardVariants}
        whileHover="hover"
        className="relative overflow-hidden group"
      >
        <div className="relative bg-linear-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-6 border border-amber-200 dark:border-amber-800/30 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <motion.div
              variants={iconVariants}
              className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30"
            >
              <Heart className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </motion.div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Detected Emotions
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Simple emotion words identified
              </p>
            </div>
          </div>
          <AnimatePresence>
            {displayedTexts.emotions && (
              <motion.div
                variants={textVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <EmotionTags emotions={emotions} />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-4 -right-4 w-16 h-16 opacity-10"
                >
                  <Zap className="w-full h-full text-amber-500" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Validation Message */}
      <motion.div
        variants={cardVariants}
        whileHover="hover"
        className="relative overflow-hidden group"
      >
        {/* Pulsing background effect */}
        <motion.div
          animate={{ opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-linear-to-r from-green-500/10 to-emerald-500/10"
        />
        
        <div className="relative bg-linear-to-br from-green-50 to-emerald-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-xl p-6 border border-green-200 dark:border-emerald-800/30 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <motion.div
              variants={iconVariants}
              className="p-2 rounded-lg bg-green-100 dark:bg-emerald-900/30"
            >
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-emerald-400" />
            </motion.div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Validation
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your feelings are acknowledged
              </p>
            </div>
          </div>
          <AnimatePresence>
            {displayedTexts.validation && (
              <motion.div
                variants={textVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="relative"
              >
                {/* Floating particles */}
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ y: 0, opacity: 0 }}
                    animate={{ 
                      y: -30, 
                      opacity: [0, 1, 0],
                      x: Math.sin(i * 1.5) * 20
                    }}
                    transition={{ 
                      duration: 2, 
                      delay: i * 0.3,
                      repeat: Infinity,
                      repeatDelay: 1
                    }}
                    className="absolute w-2 h-2 rounded-full bg-emerald-400/50"
                    style={{
                      left: `${20 + i * 30}%`,
                      top: '50%'
                    }}
                  />
                ))}
                <p className="text-gray-700 dark:text-gray-300 text-xl italic text-center p-4 relative z-10">
                  "{validation}"
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Success indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="text-center pt-4"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, ease: "linear", repeat: Infinity }}
          className="inline-block mb-2"
        >
          <div className="w-3 h-3 rounded-full bg-linear-to-r from-calm-purple-500 to-calm-blue-500" />
        </motion.div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Translation successful • Ready to communicate
        </p>
      </motion.div>
    </motion.div>
  );
};

export default ResultCard;