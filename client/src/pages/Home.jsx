import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Shield, 
  MessageSquare, 
  Heart,
  Sparkles,
  ArrowRight,
  Feather,
  Zap,
  Globe,
  HistoryIcon
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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [floatingElements, setFloatingElements] = useState([]);
  const [pulseAnimation, setPulseAnimation] = useState(false);
  const [sessionId] = useState(() => 
    localStorage.getItem('unsaid-session-id') || `session_${Date.now()}`
  );

  

  // Floating particles effect
  useEffect(() => {
    const elements = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      speed: Math.random() * 0.5 + 0.2,
      delay: Math.random() * 2
    }));
    setFloatingElements(elements);
  }, []);

  // Mouse tracking for parallax
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Periodic pulse animation
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseAnimation(true);
      setTimeout(() => setPulseAnimation(false), 1000);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    localStorage.setItem('unsaid-session-id', sessionId);
  }, [sessionId]);

  const handleTranslate = async (text) => {
  setIsLoading(true);
  setError(null);
  setTranslation(null); // Clear previous translation
  
  try {
    console.log('🔄 Starting translation for:', text.substring(0, 50) + '...');
    
    // translateEmotion now returns an object, doesn't throw
    const result = await translateEmotion(text, sessionId);
    
    console.log('📦 API Result:', result);
    
    if (result.success) {
      // The entire result IS the translation data
      setTranslation(result); // result contains all translation data
      
      // Trigger celebration animation
      setTimeout(() => {
        setPulseAnimation(true);
        setTimeout(() => setPulseAnimation(false), 500);
      }, 300);
      
      console.log('✅ Translation successful:', result.translated || result.message);
    } else {
      // Handle API error response
      setError(result.error || 'Translation failed. Please try again.');
      console.error('❌ Translation failed:', result.error);
    }
    
  } catch (err) {
    // This catches unexpected errors (network issues, etc.)
    console.error('🔥 Unexpected error:', err);
    setError('Connection error. Please check if the server is running.');
  } finally {
    setIsLoading(false);
  }
};

  const handleClear = () => {
    // Animate out before clearing
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
    <div className="min-h-screen bg-gradient-light dark:bg-gradient-dark transition-all duration-500 overflow-hidden relative">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {floatingElements.map((el) => (
          <motion.div
            key={el.id}
            className="absolute rounded-full bg-linear-to-r from-calm-purple-500 to-calm-blue-500"
            style={{
              left: `${el.x}%`,
              top: `${el.y}%`,
              width: `${el.size}px`,
              height: `${el.size}px`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.sin(Date.now() * 0.001 + el.id) * 10, 0],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 3 + el.speed,
              repeat: Infinity,
              delay: el.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Animated Background Grid */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
          transition: 'transform 0.3s ease-out'
        }}
      >
        <div className="grid grid-cols-12 gap-4 h-full">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="border-r border-calm-purple-300 dark:border-dark-purple-700" />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {showDisclaimer && (
          <Disclaimer onClose={() => setShowDisclaimer(false)} />
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 py-8 max-w-6xl relative z-10">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.8,
            type: "spring",
            stiffness: 100
          }}
          className="text-center mb-16 relative"
        >
          {/* Animated halo effect */}
          {pulseAnimation && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 mx-auto w-32 h-32 rounded-full bg-linear-to-r from-calm-purple-500/30 to-calm-blue-500/30 blur-xl"
            />
          )}
          
          <div className="flex items-center justify-center gap-4 mb-6 relative">
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: {
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                },
                scale: {
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1
                }
              }}
              className="p-4 rounded-2xl bg-linear-to-r from-calm-purple-500 to-calm-blue-500 shadow-2xl shadow-calm-purple-500/30"
            >
              <Sparkles className="w-10 h-10 text-white" />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-6xl font-bold bg-linear-to-r from-calm-purple-600 via-calm-blue-600 to-emerald-600 bg-clip-text text-transparent animate-gradient">
                UNSAID
              </h1>
            </motion.div>
          </div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8"
          >
            An emotional translation engine that helps express difficult feelings in clear, respectful language
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <motion.button
              onClick={() => setShowDisclaimer(true)}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 10px 25px -5px rgba(139, 92, 246, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 px-6 py-3 text-base rounded-full bg-calm-blue-100 dark:bg-purple-800 text-calm-blue-700 dark:text-calm-blue-300 hover:bg-calm-blue-200 dark:hover:bg-purple-700 transition-all duration-300 group"
            >
              <Shield className="w-5 h-5 group-hover:rotate-6 transition-transform" />
              Important Safety Information
            </motion.button>
            
            <motion.button
              onClick={() => onNavigate('history')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 px-6 py-3 text-base rounded-full bg-linear-to-r bg-from-blue-100 to-calm-blue-300 text-calm-blue-700 dark:text-calm-blue-300 hover:shadow-lg transition-all duration-300 dark:bg-purple-800 dark:hover:bg-purple-700"
            >
              <HistoryIcon className="w-5 h-5" />
              View Translation History
            </motion.button>
          </motion.div>
        </motion.header>

        {/* Animated Divider */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "100%", opacity: 1 }}
          transition={{ 
            delay: 0.8, 
            duration: 1.2,
            ease: "easeOut"
          }}
          className="h-px bg-linear-to-r from-transparent via-calm-purple-500/70 to-transparent mb-12"
        />

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ 
            delay: 1,
            duration: 0.8,
            ease: "easeOut"
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: 1.2 + index * 0.08, 
                duration: 0.6,
                ease: "easeOut"
              }}
              whileHover={{ 
                y: -6, 
                scale: 1.02, 
                transition: { 
                  duration: 0.3,
                  ease: "easeInOut"
                }
              }}
              whileTap={{ scale: 0.98 }} // Subtler tap effect
              className="relative group"
            >
              {/* Subtle hover glow */}
              <div className="absolute inset-0 bg-linear-to-r from-calm-purple-500/10 to-calm-blue-500/10 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative bg-white/90 dark:bg-purple-800/90 backdrop-blur-sm rounded-xl p-6 border border-calm-purple-200/30 dark:border-purple-700/30 shadow-lg hover:shadow-xl transition-all duration-500">
                <motion.div
                  whileHover={{ 
                    rotate: 5, 
                    scale: 1.05
                  }}
                  transition={{ 
                    duration: 0.4,
                    type: "spring",
                    stiffness: 200,
                    damping: 10
                  }}
                  className={`p-3 rounded-xl bg-linear-to-r ${feature.color} w-fit mb-4 shadow-md`}
                >
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </motion.div>
                
                <motion.h3 
                  className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-2"
                  whileHover={{ x: 3 }} 
                >
                  {feature.title}
                </motion.h3>
                
                <motion.p 
                  className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed"
                  initial={{ opacity: 0.7 }}
                  whileHover={{ opacity: 1 }}
                >
                  {feature.description}
                </motion.p>
                
                {/* Subtle animated underline */}
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  whileHover={{ 
                    width: "60%", 
                    opacity: 0.8 
                  }}
                  transition={{ duration: 0.4 }}
                  className="h-0.5 bg-linear-to-r from-calm-purple-400 to-calm-blue-400 mt-3 mx-auto"
                />
              </div>
              
              {/* Subtle floating effect */}
              <motion.div
                className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-calm-purple-300/20 dark:group-hover:border-calm-purple-600/10 transition-colors duration-500 pointer-events-none"
                animate={{
                  y: [0, -2, 0],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.2
                }}
              />
            </motion.div>
          ))}
        </motion.div>
        {/* Main Content */}
        <div className="space-y-16">
          {/* Input Section */}
          <motion.section
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              delay: 1.6,
              duration: 0.5,
              type: "spring",
              stiffness: 150
            }}
            className="relative"
          >
            {/* Animated glow behind input */}
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 20px rgba(139, 92, 246, 0.1)",
                  "0 0 40px rgba(139, 92, 246, 0.2)",
                  "0 0 20px rgba(139, 92, 246, 0.1)"
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 rounded-3xl pointer-events-none"
            />
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8 }}
              className="mb-10 text-center relative"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-6 -right-6 w-12 h-12 opacity-20"
              >
                <Feather className="w-full h-full text-calm-purple-500" />
              </motion.div>
              
              <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                Express Your <span className="bg-linear-to-r from-calm-purple-600 to-calm-blue-600 bg-clip-text text-transparent">Emotions</span>
              </h2>
              <motion.p
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-gray-400 dark:text-gray-400 max-w-2xl mx-auto text-lg"
              >
                Type how you're feeling—raw, unfiltered, messy. We'll help translate it into clear, respectful language.
              </motion.p>
            </motion.div>
            
            <EmotionInput 
              onTranslate={handleTranslate} 
              isLoading={isLoading}
            />
          </motion.section>

          {/* Animated waiting state */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-12"
            >
              <motion.div
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  rotate: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear"
                  },
                  scale: {
                    duration: 1,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                }}
                className="w-20 h-20 mb-6"
              >
                <Globe className="w-full h-full text-calm-purple-500" />
              </motion.div>
              <motion.p
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-lg text-gray-600 dark:text-gray-400"
              >
                Processing your emotions...
              </motion.p>
            </motion.div>
          )}

          {/* Result Section */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="bg-linear-to-r from-rose-500/10 to-pink-500/10 backdrop-blur-sm rounded-2xl p-6 border border-rose-200 dark:border-rose-800 shadow-lg"
              >
                <motion.div
                  animate={{ x: [0, -5, 5, -5, 0] }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center gap-3 mb-3"
                >
                  <Zap className="w-6 h-6 text-rose-500" />
                  <h3 className="font-bold text-rose-700 dark:text-rose-300 text-lg">
                    Translation Error
                  </h3>
                </motion.div>
                <p className="text-rose-600 dark:text-rose-400">
                  {error}
                </p>
                <motion.button
                  onClick={() => setError(null)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-4 px-4 py-2 rounded-lg bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300 hover:bg-rose-200 dark:hover:bg-rose-800 transition-colors"
                >
                  Dismiss
                </motion.button>
              </motion.div>
            )}

            {translation && (
              <motion.section
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="space-y-8"
              >
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <motion.h2 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-3xl font-bold text-gray-800 dark:text-gray-200"
                  >
                    <span className="bg-linear-to-r from-emerald-500 to-green-600 bg-clip-text text-transparent">
                      Translation Results
                    </span>
                  </motion.h2>
                  
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3"
                  >
                    <motion.button
                      onClick={() => onNavigate('history')}
                      whileHover={{ 
                        scale: 1.05,
                        x: 5,
                        transition: { type: "spring", stiffness: 400 }
                      }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-3 px-5 py-3 rounded-xl bg-linear-to-r from-calm-purple-500 to-calm-blue-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
                    >
                      View History
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <ArrowRight className="w-5 h-5" />
                      </motion.div>
                    </motion.button>
                    
                    <motion.button
                      onClick={handleClear}
                      whileHover={{ 
                        scale: 1.05,
                        rotate: 180,
                        transition: { type: "spring", stiffness: 200 }
                      }}
                      whileTap={{ scale: 0.95 }}
                      className="px-5 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 shadow-lg"
                    >
                      Clear
                    </motion.button>
                  </motion.div>
                </div>
                
                <ResultCard translation={translation} />
              </motion.section>
            )}
          </AnimatePresence>

          {/* Empty State with enhanced animation */}
          {!translation && !isLoading && !error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              className="text-center py-16 relative"
            >
              {/* Floating elements */}
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
                className="absolute top-10 left-1/4 w-8 h-8 opacity-20"
              >
                <MessageSquare className="w-full h-full text-calm-blue-500" />
              </motion.div>
              
              <motion.div
                animate={{ 
                  y: [0, 20, 0],
                  rotate: [0, -5, 5, 0]
                }}
                transition={{ 
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
                className="absolute bottom-10 right-1/4 w-6 h-6 opacity-20"
              >
                <Heart className="w-full h-full text-rose-500" />
              </motion.div>
              
              <div className="max-w-md mx-auto space-y-6">
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    boxShadow: [
                      "0 10px 30px rgba(139, 92, 246, 0.1)",
                      "0 20px 50px rgba(139, 92, 246, 0.3)",
                      "0 10px 30px rgba(139, 92, 246, 0.1)"
                    ]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="p-6 rounded-full bg-linear-to-r from-calm-blue-100 to-calm-purple-100 dark:from-dark-purple-800 dark:to-dark-purple-900 w-fit mx-auto"
                >
                  <MessageSquare className="w-12 h-12 text-calm-blue-600 dark:text-calm-blue-400" />
                </motion.div>
                
                <motion.h3
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-2xl font-bold text-gray-700 dark:text-gray-300"
                >
                  Your translation will appear here
                </motion.h3>
                
                <motion.p
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-gray-500 dark:text-gray-400 text-lg"
                >
                  Type your emotions above and click "Translate Emotion" to see the magic happen
                </motion.p>
                
                {/* Animated arrow pointing to input */}
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="pt-8"
                >
                  <ArrowRight className="w-8 h-8 text-calm-purple-500 transform rotate-90 mx-auto" />
                </motion.div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5 }}
          className="mt-20 text-center"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="inline-block p-1 rounded-2xl bg-linear-to-r from-calm-purple-500 via-calm-blue-500 to-emerald-500 animate-gradient"
          >
            <div className="bg-white dark:bg-purple-900 rounded-xl px-8 py-6">
              <p className="text-lg text-gray-700 dark:text-gray-300">
                Ready to transform your emotional communication?
              </p>
              <motion.button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-4 px-8 py-3 rounded-full bg-linear-to-r from-calm-purple-600 to-calm-blue-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Start New Translation
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>

      
    </div>
  );
};

export default Home;