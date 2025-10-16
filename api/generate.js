import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { keywords, tone } = req.body;
    if (!keywords || !tone || keywords.length !== 3) {
      return res.status(400).json({ error: "Invalid input!" });
    }

    const prompt = `
You are a social media expert. Generate one short, viral-worthy tweet (max 280 characters) based on the following:
Keywords: ${keywords.join(", ")}
Tone: ${tone}

Guidelines:
- Make it catchy and tweet-like.
- Use emojis sparingly.
- No hashtags unless naturally fitting.
- Output only the tweet text.
- Keep it short
- on the next line, add in a bracket some random chances of it to go viral
`;

    const model = genAI.getGenerativeModel({ model: "models/gemini-2.5-flash" });
    const response = await model.generateContent(prompt);
    
    const tweet = response.response.text().trim();
    res.status(200).json({ tweet });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate your tweet!" });
  }
}