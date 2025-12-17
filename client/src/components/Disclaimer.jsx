import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Shield, Heart, X, Sparkles, CheckCircle, BookOpen, Zap, Users, Brain } from 'lucide-react';

const Disclaimer = ({ onClose }) => {
  const disclaimerVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 18,
        duration: 0.6
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95, 
      y: -20,
      transition: { duration: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.4 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={disclaimerVariants}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
      onClick={onClose}
    >
      {/* Decorative floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-linear-to-r from-calm-purple-500/30 to-calm-blue-500/30"
            initial={{ 
              x: Math.random() * 100 + '%', 
              y: Math.random() * 100 + '%',
              scale: 0,
              opacity: 0
            }}
            animate={{ 
              x: [null, `calc(${Math.random() * 100}% + ${Math.random() * 50 - 25}px)`],
              y: [null, `calc(${Math.random() * 100}% + ${Math.random() * 50 - 25}px)`],
              scale: [0, 1, 0],
              opacity: [0, 0.3, 0]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut"
            }}
            style={{
              width: Math.random() * 60 + 20,
              height: Math.random() * 60 + 20,
            }}
          />
        ))}
      </div>

      <motion.div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden bg-linear-to-br from-white via-gray-50 to-calm-blue-50/30 dark:from-dark-purple-900 dark:via-gray-900 dark:to-dark-purple-800 rounded-3xl shadow-2xl shadow-calm-purple-500/10 dark:shadow-calm-purple-500/5 border border-calm-purple-200/50 dark:border-dark-purple-700/50"
        whileHover={{ scale: 1.002 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        {/* Animated gradient border */}
        <div className="absolute inset-0 rounded-3xl p-px bg-linear-to-r from-calm-purple-500/20 via-calm-blue-500/20 to-emerald-500/20 pointer-events-none" />

        {/* Header with gradient */}
        <div className="relative bg-linear-to-r from-calm-purple-500/5 via-calm-blue-500/5 to-emerald-500/5 dark:from-dark-purple-800/80 dark:via-dark-purple-800/60 dark:to-dark-purple-800/40 backdrop-blur-sm border-b border-calm-purple-200/30 dark:border-dark-purple-700/30 rounded-t-3xl p-8">
          {/* Header glow effect */}
          <div className="absolute top-0 left-1/4 w-1/3 h-1 bg-linear-to-r from-transparent via-calm-purple-500/50 to-transparent blur-sm" />
          
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  repeatDelay: 2
                }}
                className="p-3 rounded-xl bg-linear-to-br from-amber-500/20 to-orange-500/20 dark:from-amber-500/10 dark:to-orange-500/10 backdrop-blur-sm border border-amber-400/20 dark:border-amber-500/10 shadow-lg"
              >
                <AlertTriangle className="w-7 h-7 text-amber-600 dark:text-amber-400" />
              </motion.div>
              
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-calm-purple-500 dark:text-calm-purple-400" />
                  <h2 className="text-2xl font-bold bg-linear-to-r from-gray-900 via-calm-purple-600 to-calm-blue-600 dark:from-gray-100 dark:via-calm-purple-300 dark:to-calm-blue-300 bg-clip-text text-transparent">
                    Important Notice
                  </h2>
                </div>
                <motion.p
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1"
                >
                  <BookOpen className="w-3 h-3" />
                  Understanding what UNSAID is and isn't
                </motion.p>
              </div>
            </div>
            
            <motion.button
              onClick={onClose}
              whileHover={{ 
                scale: 1.1, 
                rotate: 90,
                backgroundColor: 'rgba(139, 92, 246, 0.1)'
              }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-xl hover:bg-calm-purple-100 dark:hover:bg-purple-800 transition-all duration-300 group"
              aria-label="Close disclaimer"
            >
              <div className="relative">
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-calm-purple-600 dark:group-hover:text-calm-purple-300 transition-colors" />
                <div className="absolute inset-0 bg-calm-purple-500/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.button>
          </div>
        </div>

        {/* Content with animated scroll reveal */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="p-8 space-y-8 max-h-[calc(90vh-180px)] overflow-y-auto custom-scrollbar"
        >
          {/* What UNSAID IS */}
          <motion.section 
            variants={itemVariants}
            className="relative group"
          >
            <div className="absolute -left-3 top-0 bottom-0 w-1 bg-linear-to-b from-calm-purple-500 to-calm-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="bg-linear-to-r from-calm-blue-50/50 to-emerald-50/50 dark:from-calm-blue-900/10 dark:to-emerald-900/10 rounded-2xl p-6 border border-calm-blue-200/30 dark:border-calm-blue-700/20 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-4">
                <motion.div
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  className="p-3 rounded-lg bg-linear-to-br from-calm-purple-500 to-calm-blue-500 shadow-lg"
                >
                  <Shield className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                  <h3 className="text-xl font-semibold text-calm-purple-800 dark:text-calm-purple-300">
                    What UNSAID Is
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Your emotional expression companion
                  </p>
                </div>
              </div>
              
              <div className="bg-white/50 dark:bg-purple-800/30 rounded-xl p-4 border border-calm-purple-100 dark:border-dark-purple-700/30 mb-4">
                <motion.p 
                  className="text-gray-700 dark:text-gray-300 leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  UNSAID is an <span className="font-semibold bg-linear-to-r from-calm-purple-600 to-calm-blue-600 bg-clip-text text-transparent">emotional translation engine</span> designed to help articulate complex feelings into clear, respectful communication.
                </motion.p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { text: "Translates raw emotions into clear expression", icon: Brain },
                  { text: "Provides respectful communication alternatives", icon: MessageSquare },
                  { text: "Identifies emotions without judgment", icon: Heart },
                  { text: "Enhances emotional vocabulary", icon: BookOpen }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    whileHover={{ x: 5, backgroundColor: 'rgba(139, 92, 246, 0.05)' }}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-calm-purple-50 dark:hover:bg-purple-800/50 transition-all duration-300"
                  >
                    <div className="p-2 rounded-md bg-calm-blue-100 dark:bg-calm-blue-900/30">
                      <item.icon className="w-4 h-4 text-calm-blue-600 dark:text-calm-blue-400" />
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* What UNSAID IS NOT */}
          <motion.section 
            variants={itemVariants}
            className="relative group"
          >
            <div className="absolute -left-3 top-0 bottom-0 w-1 bg-linear-to-b from-amber-500 to-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="bg-linear-to-r from-amber-50/50 to-orange-50/50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-2xl p-6 border border-amber-200/30 dark:border-amber-700/20 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-4">
                <motion.div
                  animate={{ 
                    rotate: [0, -5, 5, 0],
                    transition: { duration: 2, repeat: Infinity, repeatDelay: 1 }
                  }}
                  className="p-3 rounded-lg bg-linear-to-br from-amber-500 to-orange-500 shadow-lg"
                >
                  <AlertTriangle className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                  <h3 className="text-xl font-semibold text-amber-800 dark:text-amber-400">
                    What UNSAID Is Not
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Important limitations to understand
                  </p>
                </div>
              </div>
              
              <div className="bg-white/50 dark:bg-purple-800/30 rounded-xl p-4 border border-amber-100 dark:border-dark-purple-700/30 mb-4">
                <motion.p 
                  className="text-gray-700 dark:text-gray-300 leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  This is <span className="font-bold text-amber-700 dark:text-amber-400">NOT</span> a substitute for professional mental health support or emergency services.
                </motion.p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  "Therapy or counseling",
                  "Medical diagnosis",
                  "Professional advice",
                  "Crisis support",
                  "Human connection",
                  "Diagnostic tool"
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-2 p-3 rounded-lg bg-white/50 dark:bg-purple-800/30 border border-amber-100 dark:border-amber-900/20"
                  >
                    <div className="p-1 rounded-full bg-amber-100 dark:bg-amber-900/30">
                      <X className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Safety Guidelines */}
          <motion.section 
            variants={itemVariants}
            className="relative group"
          >
            <div className="absolute -left-3 top-0 bottom-0 w-1 bg-linear-to-b from-rose-500 to-pink-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="bg-linear-to-r from-rose-50/50 to-pink-50/50 dark:from-rose-900/10 dark:to-pink-900/10 rounded-2xl p-6 border border-rose-200/30 dark:border-rose-700/20 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-4">
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    transition: { duration: 1.5, repeat: Infinity }
                  }}
                  className="p-3 rounded-lg bg-linear-to-br from-rose-500 to-pink-500 shadow-lg"
                >
                  <Heart className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                  <h3 className="text-xl font-semibold text-rose-800 dark:text-rose-400">
                    Your Safety First
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    When professional help is needed
                  </p>
                </div>
              </div>
              
              <div className="bg-linear-to-r from-white/50 to-rose-50/30 dark:from-dark-purple-800/30 dark:to-rose-900/10 rounded-xl p-5 border border-rose-200/50 dark:border-rose-800/30 mb-4 text-center">
                <Zap className="w-8 h-8 text-rose-500 dark:text-rose-400 mx-auto mb-3" />
                <p className="text-lg font-semibold text-rose-700 dark:text-rose-300 mb-2">
                  Need Immediate Support?
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Please reach out to appropriate professionals or emergency services
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 p-4 bg-white/30 dark:bg-purple-800/20 rounded-xl">
                <Users className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <p className="text-sm text-center text-gray-700 dark:text-gray-300">
                  UNSAID is designed to complement, not replace, professional mental health care
                </p>
              </div>
            </div>
          </motion.section>

          {/* Consent Footer */}
          <motion.section 
            variants={itemVariants}
            className="text-center pt-6 border-t border-gray-200/50 dark:border-gray-800/50"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-calm-purple-500/10 to-calm-blue-500/10 dark:from-calm-purple-500/5 dark:to-calm-blue-500/5">
              <CheckCircle className="w-4 h-4 text-calm-purple-600 dark:text-calm-purple-400" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                By using UNSAID, you acknowledge these important guidelines
              </p>
            </div>
          </motion.section>
        </motion.div>

        {/* Footer with gradient button */}
        <div className="relative bg-linear-to-r from-calm-purple-500/5 via-calm-blue-500/5 to-emerald-500/5 dark:from-dark-purple-800/80 dark:via-dark-purple-800/60 dark:to-dark-purple-800/40 backdrop-blur-sm border-t border-calm-purple-200/30 dark:border-dark-purple-700/30 rounded-b-3xl p-6">
          <div className="absolute bottom-0 left-1/3 w-1/3 h-1 bg-linear-to-r from-transparent via-calm-blue-500/50 to-transparent blur-sm" />
          
          <motion.button
            onClick={onClose}
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 10px 30px rgba(139, 92, 246, 0.3)"
            }}
            whileTap={{ scale: 0.98 }}
            className="relative w-full py-4 bg-linear-to-r from-calm-purple-500 via-calm-blue-500 to-emerald-500 text-white font-medium rounded-xl hover:from-calm-purple-600 hover:via-calm-blue-600 hover:to-emerald-600 transition-all duration-500 overflow-hidden group"
          >
            {/* Button shine effect */}
            <motion.div
              className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent"
              animate={{
                x: ['-100%', '200%']
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatDelay: 2
              }}
            />
            
            <span className="relative flex items-center justify-center gap-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-5 h-5" />
              </motion.div>
              I Understand & Continue
            </span>
          </motion.button>
          
          <p className="text-xs text-center text-gray-500 dark:text-gray-500 mt-3">
            Version 1.0 • Powered by Emotional Intelligence AI
          </p>
        </div>
      </motion.div>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(139, 92, 246, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, rgba(139, 92, 246, 0.3), rgba(59, 130, 246, 0.3));
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, rgba(139, 92, 246, 0.5), rgba(59, 130, 246, 0.5));
        }
      `}</style>
    </motion.div>
  );
};

// Add missing icon imports
const MessageSquare = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

export default Disclaimer;