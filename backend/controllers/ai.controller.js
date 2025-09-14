import { VertexAI } from "@google-cloud/vertexai";
import dotenv from "dotenv"

dotenv.config()

const vertexAI = new VertexAI({
  project: process.env.GCP_PROJECT_ID,
  location: "us-central1",
});

const model = vertexAI.getGenerativeModel({ model: "gemini-1.5-pro" });

export const generateText = async (req, res) => {
  try {
    const { prompt } = req.body;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const text = result.response.candidates[0].content.parts[0].text;
    res.json({ output: text });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
