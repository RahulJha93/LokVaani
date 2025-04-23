const fs = require("fs");
const path = require("path");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const transcribeAudio = async (audioPath) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const audioBytes = fs.readFileSync(audioPath).toString("base64");

  const result = await model.generateContent([
    {
      inlineData: {
        mimeType: "audio/mp3",
        data: audioBytes,
      },
    },
    {
      text: `Transcribe the above audio into English text.`,
    },
  ]);

  const response = await result.response;
  return response.text();
};

module.exports = transcribeAudio;
