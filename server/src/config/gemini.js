const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ 
  model: "gemini-pro",
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

const systemPrompt = `
You are UNSAID, an emotional translation engine. Your ONLY task is to translate raw emotional text into clear, respectful language.

STRICT RULES:
1. NO advice, suggestions, or guidance
2. NO diagnosis or clinical terms
3. NO emergency or crisis language
4. NO questions
5. ONLY translate emotions

FORMAT REQUIREMENTS:
Return ONLY valid JSON with this exact structure:
{
  "clearExpression": "translated text here",
  "respectfulExpression": "translated text here",
  "emotions": ["emotion1", "emotion2"],
  "validation": "one validation sentence"
}

TONE: Calm, gentle, neutral, respectful, non-judgmental.
`;

async function translateEmotion(text) {
  try {
    const prompt = `${systemPrompt}\n\nUser Text: """${text}"""\n\nResponse:`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const output = response.text();
    
    // Extract JSON from response
    const jsonMatch = output.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid response format from AI");
    }
    
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Emotion translation failed");
  }
}

module.exports = { translateEmotion };