import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Shield, Heart, X } from 'lucide-react';

const Disclaimer = ({ onClose }) => {
  const disclaimerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    },
    exit: { opacity: 0, scale: 0.9 }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={disclaimerVariants}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-linear-to-br from-white to-gray-50 dark:from-dark-purple-900 dark:to-gray-900 rounded-2xl shadow-2xl border border-calm-purple-200 dark:border-dark-purple-700"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/80 dark:bg-dark-purple-900/80 backdrop-blur-sm border-b border-calm-purple-200 dark:border-dark-purple-700 rounded-t-2xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Important Notice
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Understanding what UNSAID is and isn't
                </p>
              </div>
            </div>
            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-purple-800 transition-colors"
              aria-label="Close disclaimer"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </motion.button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* What UNSAID IS */}
          <motion.section variants={itemVariants} className="space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-calm-purple-600 dark:text-calm-purple-400" />
              <h3 className="text-lg font-semibold text-calm-purple-700 dark:text-calm-purple-300">
                What UNSAID Is
              </h3>
            </div>
            <div className="bg-calm-blue-50 dark:bg-calm-blue-900/20 rounded-lg p-4">
              <p className="text-gray-700 dark:text-gray-300">
                UNSAID is an <span className="font-semibold">emotional translation engine</span> designed to help people express difficult or suppressed emotions in clear, respectful language.
              </p>
            </div>
            <ul className="space-y-2 ml-6">
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-calm-blue-500 mt-2" />
                <span className="text-gray-700 dark:text-gray-300">
                  Translates raw emotional text into clear expression
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-calm-blue-500 mt-2" />
                <span className="text-gray-700 dark:text-gray-300">
                  Provides respectful alternatives for communication
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-calm-blue-500 mt-2" />
                <span className="text-gray-700 dark:text-gray-300">
                  Identifies basic emotions without judgment
                </span>
              </li>
            </ul>
          </motion.section>

          {/* What UNSAID IS NOT */}
          <motion.section variants={itemVariants} className="space-y-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <h3 className="text-lg font-semibold text-amber-700 dark:text-amber-400">
                What UNSAID Is NOT
              </h3>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4">
              <p className="text-gray-700 dark:text-gray-300">
                This is <span className="font-semibold">NOT</span> a substitute for professional help.
              </p>
            </div>
            <ul className="space-y-2 ml-6">
              {[
                "Therapy or counseling",
                "Medical or psychological diagnosis",
                "Advice or guidance",
                "Crisis or emergency support",
                "A replacement for human connection",
                "A tool for diagnosing conditions"
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500 mt-2" />
                  <span className="text-gray-700 dark:text-gray-300">{item}</span>
                </li>
              ))}
            </ul>
          </motion.section>

          {/* Safety Guidelines */}
          <motion.section variants={itemVariants} className="space-y-3">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              <h3 className="text-lg font-semibold text-rose-700 dark:text-rose-400">
                Safety & Well-being
              </h3>
            </div>
            <div className="bg-linear-to-r from-rose-50/50 to-pink-50/50 dark:from-rose-900/20 dark:to-pink-900/20 rounded-lg p-4">
              <p className="text-gray-700 dark:text-gray-300">
                If you're experiencing a crisis or need immediate support:
              </p>
            </div>
            <div className="text-center p-4 bg-white dark:bg-dark-purple-800 rounded-lg border border-rose-200 dark:border-rose-800">
              <p className="text-lg font-semibold text-rose-700 dark:text-rose-300">
                Please reach out to appropriate professionals
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                UNSAID cannot provide emergency support or crisis intervention
              </p>
            </div>
          </motion.section>

          {/* Consent */}
          <motion.section variants={itemVariants} className="text-center pt-6 border-t border-gray-200 dark:border-gray-800">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              By using UNSAID, you acknowledge and understand these limitations
            </p>
          </motion.section>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white/80 dark:bg-dark-purple-900/80 backdrop-blur-sm border-t border-calm-purple-200 dark:border-dark-purple-700 rounded-b-2xl p-6">
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 bg-linear-to-r from-calm-purple-500 to-calm-blue-500 text-white font-medium rounded-lg hover:from-calm-purple-600 hover:to-calm-blue-600 transition-all duration-300"
          >
            I Understand
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Disclaimer;