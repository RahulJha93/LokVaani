require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
console.log(genAI)

const generateTranslatedScript = async (text, targetLanguage, type = "script") => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = type === "caption" 
    ? `
You are a professional regional language content writer specializing in ${targetLanguage}.
Translate the following content into ${targetLanguage} as a caption for a social media video.

STRICT REQUIREMENTS:
1. DO NOT include ANY hashtags in your translation
2. DO NOT include ANY English words or phrases - translate everything to pure ${targetLanguage}
3. DO NOT include any "Translation Notes" section
4. DO NOT include any social media tags, references, or metadata
5. DO NOT include any explanations or commentary about the translation
6. ONLY return the pure ${targetLanguage} translation of the content
7. Keep your translation concise and focused on the main content
8. Ensure the translation sounds natural and conversational in ${targetLanguage}
9. Preserve the original tone and style of the content
10. If there are culturally specific references, adapt them appropriately for ${targetLanguage} speakers

Text to translate:
${text}
`
    : `
You are a professional regional language content writer specializing in ${targetLanguage}.
Translate the following content into ${targetLanguage} as a ${type} for a social media video.

STRICT REQUIREMENTS:
1. DO NOT include ANY hashtags in your translation
2. DO NOT include ANY English words or phrases - translate everything to pure ${targetLanguage}
3. DO NOT include any "Translation Notes" section
4. DO NOT include any social media tags, references, or metadata
5. DO NOT include any explanations or commentary about the translation
6. ONLY return the pure ${targetLanguage} translation of the content
7. Ensure the translation sounds natural and conversational in ${targetLanguage}
8. Preserve the original tone and style of the content
9. If there are culturally specific references, adapt them appropriately for ${targetLanguage} speakers

Text to translate:
${text}
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let translatedText = response.text();
    
    // Additional post-processing to ensure requirements are met
    
    // Remove any hashtags that might have been generated
    translatedText = translatedText.replace(/#\w+/g, '');
    
    // Remove any English words that might have remained
    translatedText = translatedText.replace(/\b[a-zA-Z]+\b/g, '');
    
    // Remove any "Translation Notes" section if present
    if (translatedText.includes("Translation Notes")) {
      translatedText = translatedText.split(/Translation Notes/i)[0].trim();
    }
    
    // Remove any markdown formatting
    translatedText = translatedText.replace(/\*\*([^*]+)\*\*/g, '$1');
    
    // Clean up extra whitespace
    translatedText = translatedText.replace(/\s+/g, ' ').trim();
    
    return translatedText;
  } catch (err) {
    console.error("Gemini content generation error:", err.message);
    return null;
  }
};

module.exports = generateTranslatedScript;
