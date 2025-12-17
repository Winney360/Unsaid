// src/utils/emotionAnalyzer.js
const analyzeEmotionalContext = (translation) => {
  const emotions = translation.emotions || [];
  const text = (translation.clearExpression || '').toLowerCase();
  
  const analysis = {
    primaryEmotion: emotions[0] || 'emotional',
    intensity: 'medium',
    communicationStyle: 'balanced',
    needs: [],
    strengths: []
  };
  
  // Intensity analysis
  const highIntensityWords = ['extremely', 'completely', 'absolutely', 'totally', 'utterly'];
  const hasHighIntensity = highIntensityWords.some(word => text.includes(word));
  const emotionCount = emotions.length;
  
  if (hasHighIntensity || emotionCount >= 4) {
    analysis.intensity = 'high';
  } else if (emotionCount <= 1) {
    analysis.intensity = 'low';
  }
  
  // Communication style analysis
  if (text.includes('i feel') && !text.includes('you are')) {
    analysis.communicationStyle = 'owning';
    analysis.strengths.push('Uses I-statements');
  }
  
  if (text.includes('would like') || text.includes('could we')) {
    analysis.communicationStyle = 'solution-focused';
    analysis.strengths.push('Seeks resolution');
  }
  
  if (text.includes('i need') || text.includes('i would appreciate')) {
    analysis.communicationStyle = 'needs-expressed';
    analysis.needs.push('Recognition', 'Understanding');
  }
  
  return analysis;
};

// Generate validation based on analysis
const generateContextualValidation = (analysis) => {
  const { primaryEmotion, intensity, communicationStyle, strengths, needs } = analysis;
  
  const templates = {
    owning: [
      `Using "I feel" statements to express ${primaryEmotion} shows emotional maturity.`,
      `Owning your ${primaryEmotion} without blame creates space for understanding.`,
      `This direct expression of ${primaryEmotion} demonstrates self-awareness.`
    ],
    'solution-focused': [
      `Combining ${primaryEmotion} with solution-seeking is a powerful communication approach.`,
      `Your ${intensity} ${primaryEmotion} paired with constructive thinking shows resilience.`,
      `This balanced expression addresses both feelings and forward movement.`
    ],
    'needs-expressed': [
      `Clearly stating needs alongside ${primaryEmotion} is relationship-healthy.`,
      `Your expression of ${primaryEmotion} includes important information about what you need.`,
      `Naming ${primaryEmotion} and needs together creates clarity for everyone.`
    ],
    balanced: [
      `Your expression of ${primaryEmotion} is clear and respectful.`,
      `This balanced communication about ${primaryEmotion} maintains relationship integrity.`,
      `You've expressed ${primaryEmotion} in a way that honors both your experience and the relationship.`
    ]
  };
  
  const style = communicationStyle in templates ? communicationStyle : 'balanced';
  const options = templates[style];
  
  // Add strength-specific validation
  if (strengths.length > 0) {
    const strengthValidations = strengths.map(strength => 
      `Your ${strength.toLowerCase()} in expressing ${primaryEmotion} is commendable.`
    );
    options.push(...strengthValidations);
  }
  
  // Add need acknowledgment
  if (needs.length > 0) {
    const needValidations = needs.map(need =>
      `Acknowledging your need for ${need.toLowerCase()} alongside ${primaryEmotion} is important.`
    );
    options.push(...needValidations);
  }
  
  // Add intensity-specific validation
  if (intensity === 'high') {
    options.push(
      `Managing ${intensity} ${primaryEmotion} with this clarity shows emotional strength.`,
      `Your ability to articulate ${intensity} ${primaryEmotion} is a valuable skill.`
    );
  }
  
  return options[Math.floor(Math.random() * options.length)];
};

module.exports = {
  analyzeEmotionalContext,
  generateContextualValidation
};