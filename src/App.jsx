import { useState } from "react";
import { motion } from "framer-motion";
import Keyword from "./components/Keyword";
import ToneSelector from "./components/ToneSelector";
import Bird3D from "./components/Bird3D";

export default function App() {
  const [keywords, setKeywords] = useState(["", "", ""]);
  const [tone, setTone] = useState("funny");
  const [tweet, setTweet] = useState("");
  const [loading, setLoading] = useState(false);
  const [isReacting, setIsReacting] = useState(false);

  const handleKeywordChange = (index, value) => {
    const updated = [...keywords];
    updated[index] = value;
    setKeywords(updated);
  };

  const generateTweet = async () => {
    if (keywords.some((k) => !k)) {
      setTweet("⚠️ Please fill all three keywords!");
      return;
    }

    setLoading(true);
    setIsReacting(true);
    setTweet("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keywords, tone }),
      });

      const data = await res.json();

      if (res.ok) {
        setTweet(data.tweet);
      } else {
        setTweet("⚠️ Failed to generate tweet.");
        console.error(data.error);
      }
    } catch (err) {
      console.error(err);
      setTweet("⚠️ Something went wrong. Try again!");
    } finally {
      setLoading(false);
      setTimeout(() => {
        setIsReacting(false);
      }, 800);
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-black">
      <Bird3D isReacting={isReacting} />
      <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg p-6 w-[90%] sm:w-[420px] text-center">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">🐥 Bunger Post</h1>

        <div className="flex flex-col gap-3 mb-4">
          {keywords.map((kw, i) => (
            <Keyword
              key={i}
              value={kw}
              onChange={(v) => handleKeywordChange(i, v)}
              placeholder={`Keyword ${i + 1}`}
            />
          ))}
        </div>

        <ToneSelector tone={tone} onChange={setTone} />

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={generateTweet}
          disabled={loading}
          className={`mt-3 w-full py-2 rounded-lg text-white ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-pink-500"
          }`}
        >
          {loading ? "Generating..." : "Generate Tweet 🚀"}
        </motion.button>

        {tweet && (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="mt-6 p-4 bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl border border-pink-200 shadow-md hover:shadow-lg transition-shadow w-full"
  >
    <p className="text-gray-800 font-medium text-base leading-relaxed break-words whitespace-pre-wrap w-full">
      {tweet}
    </p>
    <p className="text-gray-500 text-xs mt-3">
      {tweet.length}/280 characters
    </p>
  </motion.div>
)}
      </div>
    </div>
  );
}
