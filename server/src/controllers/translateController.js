const Translation = require('../models/Translation');
const { translateEmotion } = require('../config/gemini');
const { generateValidation, getValidationCategory, getValidationIcon, getValidationColor } = require('../utils/validationEngine');
const { analyzeEmotionalContext, generateContextualValidation } = require('../utils/emotionAnalyzer');

exports.processTranslation = async (req, res) => {
  try {
    const { text, sessionId = 'default' } = req.body;

    console.log('📝 Translation request:', { 
      text: text?.substring(0, 100), 
      sessionId 
    });

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ 
        success: false,
        error: "Text is required" 
      });
    }

    // Call Gemini API for translation
    let translationResult;
    try {
      console.log('🤖 Calling Gemini API...');
      translationResult = await translateEmotion(text);
      console.log('✅ Gemini response received');
    } catch (geminiError) {
      console.error('❌ Gemini API failed:', geminiError.message);
      
      // Create enhanced mock response with emotion analysis
      const mockEmotions = analyzeTextForEmotions(text);
      translationResult = {
        clearExpression: `I feel ${mockEmotions[0] || 'emotional'} when "${text.substring(0, 50)}..."`,
        respectfulExpression: `I'm experiencing ${mockEmotions.join(' and ')} feelings about this situation.`,
        emotions: mockEmotions,
        // Leave validation empty - will be generated below
      };
    }

    // Log the raw result for debugging
    console.log('📊 Raw translation result:', {
      hasClearExpression: !!translationResult.clearExpression,
      hasRespectfulExpression: !!translationResult.respectfulExpression,
      emotions: translationResult.emotions?.length || 0,
      hasValidation: !!translationResult.validation
    });

    // Generate context-aware validation using the new engine
    let finalValidation;
    let validationCategory = 'general';
    let validationIcon = '✅';
    let validationColor = 'from-gray-500 to-slate-500';
    
    try {
      // First try advanced contextual analysis
      const emotionalAnalysis = analyzeEmotionalContext(translationResult);
      console.log('🧠 Emotional analysis:', emotionalAnalysis);
      
      finalValidation = generateContextualValidation(emotionalAnalysis);
      validationCategory = getValidationCategory(finalValidation);
      validationIcon = getValidationIcon(validationCategory);
      validationColor = getValidationColor(validationCategory);
      
      console.log('🎯 Generated contextual validation:', {
        category: validationCategory,
        length: finalValidation?.length,
        preview: finalValidation?.substring(0, 80)
      });
    } catch (analysisError) {
      console.warn('⚠️ Contextual analysis failed, using basic validation:', analysisError.message);
      
      // Fallback to basic validation
      finalValidation = generateValidation(translationResult);
      validationCategory = getValidationCategory(finalValidation);
      validationIcon = getValidationIcon(validationCategory);
      validationColor = getValidationColor(validationCategory);
    }

    // Ensure we always have a validation
    if (!finalValidation || finalValidation.trim().length === 0) {
      finalValidation = "Your feelings are valid and deserve to be expressed respectfully.";
      console.log('⚠️ Using default validation');
    }

    // Create the enhanced translation result with validation metadata
    const enhancedTranslationResult = {
      ...translationResult,
      validation: finalValidation,
      validationCategory,
      validationIcon,
      validationColor,
      // Remove any existing validation from Gemini to avoid duplication
      ...(translationResult.validation && { originalValidation: translationResult.validation })
    };

    // Save to database
    let savedTranslation;
    try {
      const translation = new Translation({
        rawText: text,
        clearExpression: enhancedTranslationResult.clearExpression,
        respectfulExpression: enhancedTranslationResult.respectfulExpression,
        emotions: enhancedTranslationResult.emotions,
        validation: enhancedTranslationResult.validation,
        validationCategory: enhancedTranslationResult.validationCategory,
        validationIcon: enhancedTranslationResult.validationIcon,
        validationColor: enhancedTranslationResult.validationColor,
        sessionId,
        timestamp: new Date()
      });

      savedTranslation = await translation.save();
      console.log('💾 Saved to database:', savedTranslation._id);
    } catch (dbError) {
      console.error('❌ Database save failed:', dbError.message);
      // Continue without database save - create mock saved object
      savedTranslation = {
        _id: `mock_${Date.now()}`,
        timestamp: new Date().toISOString()
      };
    }

    // Return enhanced response
    const response = {
      success: true,
      translation: enhancedTranslationResult,
      id: savedTranslation._id,
      timestamp: savedTranslation.timestamp || new Date().toISOString(),
      metadata: {
        validationGenerated: true,
        validationCategory,
        source: translationResult.originalValidation ? 'gemini+engine' : 'validation-engine'
      }
    };

    console.log('✅ Translation completed successfully');
    res.json(response);
    
  } catch (error) {
    console.error("❌ Controller error:", error);
    res.status(500).json({ 
      success: false,
      error: "Failed to process translation",
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      suggestion: "Please try again with different wording"
    });
  }
};

exports.getTranslationHistory = async (req, res) => {
  try {
    const { sessionId = 'default' } = req.query;
    
    console.log('📜 History request for session:', sessionId);
    
    let translations = [];
    try {
      translations = await Translation.find({ sessionId })
        .sort({ timestamp: -1 })
        .limit(50)
        .select('-__v'); // Exclude version key
      
      console.log(`📊 Found ${translations.length} translations in DB`);
      
      // Ensure all translations have validation metadata
      translations = translations.map(trans => ({
        ...trans.toObject(),
        validationCategory: trans.validationCategory || 'general',
        validationIcon: trans.validationIcon || '✅',
        validationColor: trans.validationColor || 'from-gray-500 to-slate-500'
      }));
      
    } catch (dbError) {
      console.warn('⚠️ Database query failed, returning mock data:', dbError.message);
      
      // Return enhanced mock history with validation metadata
      translations = [
        {
          _id: 'mock_1',
          rawText: "I feel ignored by my friend",
          clearExpression: "I feel overlooked when my messages aren't acknowledged",
          respectfulExpression: "I would appreciate more consistent communication in our friendship",
          emotions: ['sad', 'lonely', 'unappreciated'],
          validation: "Expressing sadness while stating your needs creates opportunity for support.",
          validationCategory: 'sadness',
          validationIcon: '💧',
          validationColor: 'from-blue-500 to-indigo-500',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          sessionId: sessionId
        },
        {
          _id: 'mock_2',
          rawText: "This situation makes me angry",
          clearExpression: "I feel frustrated with how this was handled",
          respectfulExpression: "I'm finding this situation challenging and would like to discuss alternatives",
          emotions: ['angry', 'frustrated', 'disappointed'],
          validation: "Channeling anger into constructive communication shows emotional intelligence.",
          validationCategory: 'anger',
          validationIcon: '🔥',
          validationColor: 'from-rose-500 to-orange-500',
          timestamp: new Date(Date.now() - 172800000).toISOString(),
          sessionId: sessionId
        }
      ];
    }

    res.json({
      success: true,
      translations,
      count: translations.length,
      metadata: {
        hasDynamicValidation: translations.some(t => t.validationCategory && t.validationCategory !== 'general'),
        validationCategories: [...new Set(translations.map(t => t.validationCategory || 'general'))]
      }
    });
    
  } catch (error) {
    console.error("❌ History error:", error);
    res.status(500).json({ 
      success: false,
      error: "Failed to fetch history",
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Helper function for mock emotion analysis
function analyzeTextForEmotions(text) {
  const textLower = text.toLowerCase();
  const emotions = [];
  
  const emotionMap = [
    { keywords: ['angry', 'mad', 'furious', 'pissed'], emotions: ['angry', 'frustrated'] },
    { keywords: ['sad', 'unhappy', 'depressed', 'cry', 'tears'], emotions: ['sad', 'disappointed'] },
    { keywords: ['happy', 'joy', 'excited', 'great', 'wonderful'], emotions: ['happy', 'pleased'] },
    { keywords: ['scared', 'afraid', 'anxious', 'worried', 'nervous'], emotions: ['scared', 'anxious'] },
    { keywords: ['unloved', 'ignored', 'lonely', 'abandoned', 'rejected'], emotions: ['lonely', 'unappreciated'] },
    { keywords: ['overwhelmed', 'stressed', "can't stand", 'too much', 'exhausted'], emotions: ['overwhelmed', 'stressed'] }
  ];
  
  emotionMap.forEach(({ keywords, emotions: emoteList }) => {
    if (keywords.some(keyword => textLower.includes(keyword))) {
      emotions.push(...emoteList);
    }
  });
  
  if (emotions.length === 0) {
    emotions.push('emotional', 'expressive');
  }
  
  // Remove duplicates
  return [...new Set(emotions)];
}