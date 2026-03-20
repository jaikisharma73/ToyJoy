import express from "express";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import productModel from "../models/productModel.js";

dotenv.config();
const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

// Store conversation histories per session (in-memory, keyed by a simple session id)
const conversations = new Map();

router.post("/", async (req, res) => {
  try {
     const chat = model.startChat({ history: [] }); 
    const userMessage = req.body.message;
    const sessionId = req.body.sessionId || "default";

    if (!userMessage || !userMessage.trim()) {
      return res.json({ reply: "Please type a message to get started! 🧸" });
    }

    // Fetch all products from database for context
    const products = await productModel.find({});
    const productCatalog = products.map(p => ({
      name: p.name,
      category: p.category,
      subCategory: p.subCategory,
      price: p.price,
      description: p.description,
      bestseller: p.bestseller || false
    }));

    // Get available categories and subcategories
    const categories = [...new Set(products.map(p => p.category))];
    const subCategories = [...new Set(products.map(p => p.subCategory))];

    const systemPrompt = `You are "ToyJoy AI" — a friendly, knowledgeable toy advisor for parents shopping on ToyJoy, an online toy store.

YOUR ROLE:
- Help parents find the perfect toy for their child based on age, interests, gender, budget, and occasion.
- Be warm, enthusiastic, and use emojis naturally.
- Always recommend toys FROM the product catalog provided below.
- Give specific product name recommendations when possible.
- Keep responses concise (2-4 sentences max) and helpful.

PRODUCT CATALOG:
${JSON.stringify(productCatalog, null, 2)}

AVAILABLE CATEGORIES: ${categories.join(", ")}
AVAILABLE SUB-CATEGORIES: ${subCategories.join(", ")}

RESPONSE FORMAT:
You MUST respond with valid JSON in this exact format (no markdown, no code blocks, just raw JSON):
{
  "reply": "Your friendly response text here with emoji",
  "filter": {
    "category": "matching category from available categories or empty string",
    "subCategory": "matching subCategory from available sub-categories or empty string"
  }
}

FILTER RULES:
- Set "category" if the user mentions gender (Boys/Girls/Kids) or you can infer it.
- Set "subCategory" if you can determine the toy type from the conversation.
- Use EXACT category/subCategory values from the available lists above.
- If unsure, leave as empty string "".
- Both can be set, one can be set, or both empty — depending on context.

EXAMPLES:
User: "My son is 5 and loves building things"
Response: {"reply": "🧱 Great choice! For a 5-year-old boy who loves building, I'd recommend our Building & Construction Toys! Check out building blocks and construction sets — they're perfect for developing creativity and motor skills. 🏗️", "filter": {"category": "Boys", "subCategory": "Building & Construction Toys"}}

User: "What's good for a toddler girl?"
Response: {"reply": "🍼 For a toddler girl, I'd suggest our Educational Toys! Soft learning toys, colorful puzzles, and musical toys are wonderful at that age. They're safe, fun, and help with early development! 🌈", "filter": {"category": "Girls", "subCategory": "Educational Toys"}}

User: "Show me outdoor toys"
Response: {"reply": "⚽ Looking for outdoor fun? Our Indoor & Outdoor Play Toys section has amazing options! From sports sets to ride-on toys, there's plenty to keep your little ones active and happy! 🌞", "filter": {"category": "", "subCategory": "Indoor & Outdoor Play Toys"}}`;

    // Get or create conversation history
    if (!conversations.has(sessionId)) {
      conversations.set(sessionId, []);
    }
    const history = conversations.get(sessionId);

    // Build the model
   const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  systemInstruction: {
    role: "system",
    parts: [{
      text: `You are ToyJoy AI, a friendly toy recommendation assistant.
Respond in JSON:
{
 "reply": "...",
 "filter": { "category": "", "subCategory": "" }
}`
    }]
  }
});

    // Send message
    const result = await chat.sendMessage(userMessage);
    const responseText = result.response.text();

    // Store conversation for context
    history.push({ role: "user", text: userMessage });
    history.push({ role: "model", text: responseText });

    // Keep history manageable (last 20 messages)
    if (history.length > 20) {
      history.splice(0, history.length - 20);
    }

    // Parse the JSON response
    let parsed;
    try {
      // Clean the response — remove markdown code blocks if present
      let cleanResponse = responseText.trim();
      if (cleanResponse.startsWith("```")) {
        cleanResponse = cleanResponse.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
      }
      parsed = JSON.parse(cleanResponse);
    } catch (parseError) {
      // If JSON parsing fails, use the raw text as reply
      parsed = {
        reply: responseText,
        filter: { category: "", subCategory: "" }
      };
    }

    res.json({
      reply: parsed.reply || responseText,
      filter: parsed.filter || { category: "", subCategory: "" }
    });

  } catch (error) {
    console.log("Chat API Error:", error);
    res.json({
      reply: "⚠️ I'm having a little trouble right now. Please try again in a moment! 🧸",
      filter: { category: "", subCategory: "" }
    });
  }
});

export default router;