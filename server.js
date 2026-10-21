const express = require("express");
const multer = require("multer");
const path = require("path");
const app = express();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 8 * 1024 * 1024, files: 4 } });
app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/health", (_req, res) => res.json({
  ok: true,
  chatConfigured: Boolean(process.env.OPENAI_API_KEY),
  videoConfigured: Boolean(process.env.VIDEO_API_URL && process.env.VIDEO_API_KEY)
}));

app.post("/api/chat", upload.array("files", 4), async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) return res.status(503).json({ error: "AI chat চালু করতে hosting-এর Environment Variables-এ OPENAI_API_KEY যোগ করুন।" });
    const message = String(req.body.message || "").trim();
    const history = safeHistory(req.body.history);
    if (!message && !(req.files || []).length) return res.status(400).json({ error: "একটি মেসেজ লিখুন অথবা ছবি যুক্ত করুন।" });
    const content = [];
    if (message) content.push({ type: "input_text", text: message });
    for (const file of (req.files || [])) {
      if (!file.mimetype.startsWith("image/")) return res.status(415).json({ error: "এই starter-এ ছবি বিশ্লেষণ সমর্থিত; আপাতত শুধু ছবি যুক্ত করুন।" });
      content.push({ type: "input_image", image_url: `data:${file.mimetype};base64,${file.buffer.toString("base64")}`, detail: "auto" });
    }
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
        instructions: "You are Nova AI, a helpful assistant. Reply in the user's language, including Bangla when appropriate. Be clear, safe, and concise.",
        input: [...history, { role: "user", content }],
        max_output_tokens: 900
      })
    });
    const data = await response.json();
    if (!response.ok) {
      console.error("OpenAI API error:", data);
      return res.status(response.status).json({ error: data.error?.message || "AI উত্তর পাওয়া যায়নি। API key, billing ও model settings দেখুন।" });
    }
    const answer = (data.output || []).flatMap(x => x.content || []).filter(x => x.type === "output_text").map(x => x.text).join("\\n").trim();
    res.json({ answer: answer || "এইবার উত্তর পাওয়া যায়নি। আবার চেষ্টা করুন।" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "সার্ভারে সমস্যা হয়েছে। পরে আবার চেষ্টা করুন।" });
  }
});

app.post("/api/video", async (req, res) => {
  const prompt = String(req.body?.prompt || "").trim();
  if (!prompt) return res.status(400).json({ error: "ভিডিওর বর্ণনা লিখুন।" });
  if (!process.env.VIDEO_API_URL || !process.env.VIDEO_API_KEY) {
    return res.status(501).json({ error: "ভিডিও জেনারেশন এখনো যুক্ত হয়নি। একটি video API provider বেছে তার official API adapter যোগ করতে হবে।" });
  }
  return res.status(501).json({ error: "এই provider-এর adapter এখনো implement করা হয়নি; provider-এর API অনুযায়ী backend integration দরকার।" });
});

function safeHistory(raw) {
  let value;
  try { value = typeof raw === "string" ? JSON.parse(raw || "[]") : raw; } catch { value = []; }
  if (!Array.isArray(value)) return [];
  return value.slice(-10).filter(x => x && ["user","assistant"].includes(x.role) && typeof x.content === "string")
    .map(x => ({ role: x.role, content: x.content.slice(0, 4000) }));
}
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Nova AI running on port ${port}`));
