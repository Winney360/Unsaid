// src/config/gemini.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Priority order: Models with free tier access first
const MODEL_OPTIONS = [
  "gemini-2.5-flash-lite",   // Best free tier limits (~1000 requests/day)
  "gemini-2.5-flash",        // Good free tier access
  "gemini-2.0-flash",        // Last resort - requires billing
  "gemini-2.5-pro",          // Last resort - requires billing
];

const systemPrompt = `
You are UNSAID, an emotional translation engine. Your ONLY task is to translate raw emotional text into clear, respectful language.

STRICT RULES:
1. NO advice, suggestions, or guidance
2. NO diagnosis or clinical terms
3. NO emergency or crisis language
4. NO questions
5. ONLY translate emotions
6. DO NOT include validation messages

FORMAT REQUIREMENTS:
Return ONLY valid JSON with this exact structure:
{
  "clearExpression": "translated text here",
  "respectfulExpression": "translated text here",
  "emotions": ["emotion1", "emotion2"],
}

TONE: Calm, gentle, neutral, respectful, non-judgmental.
`;

// Cache to track which models are working
const workingModels = new Set();

async function translateEmotion(text) {
  let lastError = null;
  
  // First, try models that worked before
  const priorityOrder = [
    ...Array.from(workingModels), // Previously working models first
    ...MODEL_OPTIONS.filter(m => !workingModels.has(m)) // Then others
  ];
  
  for (const modelName of priorityOrder) {
    try {
      console.log(`🤖 Trying model: ${modelName}`);
      
      const model = genAI.getGenerativeModel({ 
        model: modelName,
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_NONE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_NONE"
          }
        ]
      });
      
      const prompt = `${systemPrompt}\n\nUser Text: """${text}"""\n\nResponse:`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const output = response.text();
      
      // Mark this model as working for future requests
      workingModels.add(modelName);
      console.log(`✅ ${modelName} worked! (Added to working set)`);
      
      // Extract JSON
      const jsonMatch = output.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.warn(`⚠️ ${modelName} returned non-JSON, trying next model`);
        console.log('Raw output:', output.substring(0, 200));
        continue;
      }
      
      return JSON.parse(jsonMatch[0]);
      
    } catch (error) {
      lastError = error;
      
      // Check if it's a quota error (429)
      if (error.message.includes('429') || error.message.includes('quota')) {
        console.log(`⏸️ ${modelName} quota exceeded, will skip for now`);
        // Don't mark as permanently failed, just skip this time
      } else {
        console.log(`❌ ${modelName} failed: ${error.message.split('\n')[0]}`);
      }
      
      // Remove from working set if it fails
      workingModels.delete(modelName);
    }
  }
  
  // If all models failed
  console.error("All Gemini models failed, using mock");
  throw new Error(`Gemini translation failed: ${lastError?.message?.split('\n')[0] || 'All models unavailable'}`);
}

module.exports = { translateEmotion };