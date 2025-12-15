const Translation = require('../models/Translation');
const { translateEmotion } = require('../config/gemini');

exports.processTranslation = async (req, res) => {
  try {
    const { text, sessionId = 'default' } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: "Text is required" });
    }

    // Call Gemini API for translation
    const translationResult = await translateEmotion(text);

    // Save to database
    const translation = new Translation({
      rawText: text,
      clearExpression: translationResult.clearExpression,
      respectfulExpression: translationResult.respectfulExpression,
      emotions: translationResult.emotions,
      validation: translationResult.validation,
      sessionId
    });

    await translation.save();

    res.json({
      success: true,
      translation: translationResult,
      id: translation._id,
      timestamp: translation.timestamp
    });
  } catch (error) {
    console.error("Translation error:", error);
    res.status(500).json({ 
      error: "Failed to process translation",
      message: error.message 
    });
  }
};

exports.getTranslationHistory = async (req, res) => {
  try {
    const { sessionId = 'default' } = req.query;
    
    const translations = await Translation.find({ sessionId })
      .sort({ timestamp: -1 })
      .limit(50);

    res.json({
      success: true,
      translations
    });
  } catch (error) {
    console.error("History error:", error);
    res.status(500).json({ 
      error: "Failed to fetch history" 
    });
  }
};