// src/utils/validationEngine.js

const generateValidation = (translation) => {
  const emotions = translation.emotions || translation.emotionTags || [];
  const clearText = translation.clearExpression || translation.text || '';
  const respectfulText = translation.respectfulExpression || translation.alternative || '';
  
  // Analyze emotional intensity
  const highIntensityEmotions = ['angry', 'furious', 'rage', 'hate', 'desperate', 'panicked'];
  const mediumIntensityEmotions = ['frustrated', 'upset', 'annoyed', 'worried', 'sad'];
  const lowIntensityEmotions = ['content', 'calm', 'peaceful', 'happy', 'joyful'];
  
  // Check for specific emotional categories
  const hasAnger = emotions.some(e => ['angry', 'frustrated', 'annoyed', 'rage'].includes(e.toLowerCase()));
  const hasSadness = emotions.some(e => ['sad', 'depressed', 'lonely', 'hurt', 'grief'].includes(e.toLowerCase()));
  const hasAnxiety = emotions.some(e => ['anxious', 'worried', 'scared', 'afraid', 'nervous'].includes(e.toLowerCase()));
  const hasPositive = emotions.some(e => ['happy', 'joy', 'excited', 'hopeful', 'proud'].includes(e.toLowerCase()));
  
  // Analyze text content
  const text = clearText.toLowerCase();
  const hasIStatements = text.startsWith('i feel') || text.includes('i feel');
  const hasYouStatements = text.includes('you make me') || text.includes('you always');
  const hasBlame = text.includes('blame') || text.includes('fault') || hasYouStatements;
  const hasSolution = text.includes('would like') || text.includes('could we') || text.includes('maybe we');
  
  // Calculate complexity score
  const complexityScore = emotions.length * 0.3 + (clearText.length > 100 ? 0.2 : 0);
  
  // Generate validation based on analysis
  const validations = [];
  
  // Emotional validation
  if (hasAnger) {
    validations.push(
      "It's completely normal to feel anger. Acknowledging it is the first step toward constructive communication.",
      "Anger often signals that something important to us feels threatened. Your expression helps identify what matters.",
      "Turning anger into clear communication shows emotional intelligence and strength."
    );
  }
  
  if (hasSadness) {
    validations.push(
      "Sadness deserves space and acknowledgment. You're giving your feelings the respect they need.",
      "Expressing sadness openly creates opportunities for connection and understanding.",
      "Your vulnerability in naming this sadness is a sign of emotional courage."
    );
  }
  
  if (hasAnxiety) {
    validations.push(
      "Anxiety often comes from caring deeply. Your clarity helps separate real concerns from worries.",
      "Naming anxiety reduces its power and helps others understand your experience.",
      "You're transforming anxious feelings into clear communication, which is a powerful skill."
    );
  }
  
  if (hasPositive) {
    validations.push(
      "Celebrating positive emotions strengthens relationships and builds connection.",
      "Sharing joy and happiness invites others to celebrate with you.",
      "Positive emotions deserve expression too - you're building emotional intimacy."
    );
  }
  
  // Communication style validation
  if (hasIStatements && !hasBlame) {
    validations.push(
      "Using 'I feel' statements creates ownership without blame - excellent communication technique.",
      "Your 'I feel' approach minimizes defensiveness and maximizes understanding.",
      "This is a healthy communication pattern that focuses on your experience rather than accusing others."
    );
  }
  
  if (hasSolution) {
    validations.push(
      "Including potential solutions shows you're thinking constructively about the relationship.",
      "Your forward-thinking approach focuses on resolution rather than just stating problems.",
      "This balanced expression of feeling and solution-seeking is relationship-strengthening."
    );
  }
  
  // Intensity-based validation
  if (complexityScore > 1) {
    validations.push(
      "You're managing complex emotions with impressive clarity and self-awareness.",
      "Navigating multiple emotions simultaneously shows significant emotional intelligence.",
      "This level of emotional complexity handled with such clarity is remarkable."
    );
  }
  
  // Default validations if nothing specific matches
  const defaultValidations = [
    "Your feelings are valid and deserve to be expressed respectfully.",
    "This expression maintains your dignity while honestly communicating your experience.",
    "You've found words for feelings that can be difficult to articulate - that's an important skill.",
    "Clear emotional expression like this builds healthier relationships and self-understanding.",
    "You're respecting both your own feelings and the relationship with this communication."
  ];
  
  // Combine specific and default validations
  const allValidations = [...validations, ...defaultValidations];
  
  // Select based on emotional content
  if (validations.length > 0) {
    // Weight random selection toward specific validations
    const specificWeight = 0.7; // 70% chance of specific validation
    const useSpecific = Math.random() < specificWeight && validations.length > 0;
    
    if (useSpecific) {
      return validations[Math.floor(Math.random() * validations.length)];
    }
  }
  
  // Fallback to default
  return allValidations[Math.floor(Math.random() * allValidations.length)];
};

// Optional: Categorize for different UI displays
const getValidationCategory = (validation) => {
  if (validation.includes('anger') || validation.includes('frustrated')) return 'anger';
  if (validation.includes('sad') || validation.includes('hurt')) return 'sadness';
  if (validation.includes('anxious') || validation.includes('worried')) return 'anxiety';
  if (validation.includes('happy') || validation.includes('joy')) return 'positive';
  if (validation.includes('complex') || validation.includes('multiple')) return 'complex';
  return 'general';
};

// Get validation icon based on category
const getValidationIcon = (category) => {
  const icons = {
    anger: '🔥',
    sadness: '💧',
    anxiety: '🌀',
    positive: '✨',
    complex: '🧩',
    general: '✅'
  };
  return icons[category] || icons.general;
};

// Get validation color based on category
const getValidationColor = (category) => {
  const colors = {
    anger: 'from-rose-500 to-orange-500',
    sadness: 'from-blue-500 to-indigo-500',
    anxiety: 'from-amber-500 to-yellow-500',
    positive: 'from-emerald-500 to-green-500',
    complex: 'from-purple-500 to-pink-500',
    general: 'from-gray-500 to-slate-500'
  };
  return colors[category] || colors.general;
};

// Export using CommonJS
module.exports = {
  generateValidation,
  getValidationCategory,
  getValidationIcon,
  getValidationColor
};