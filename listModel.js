import dotenv from 'dotenv';
dotenv.config();

async function listModels() {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`
    );
    const data = await response.json();
    console.log("Full response:", JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error listing models:", err);
  }
}

listModels();