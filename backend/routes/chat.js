import express from "express";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import productModel from "../models/productModel.js";

dotenv.config();
const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

// Store conversation histories per session
const conversations = new Map();

router.post("/", async (req, res) => {
  try {
    const userMessage = req.body.message;
    const sessionId = req.body.sessionId || "default";

    if (!userMessage || !userMessage.trim()) {
      return res.json({
        reply: "Please type a message to get started! 🧸",
        filter: { category: "", subCategory: "" }
      });
    }

    // Fetch products from database
    const products = await productModel.find({});
    const productCatalog = products.map(p => ({
      name: p.name,
      category: p.category,
      subCategory: p.subCategory,
      price: p.price,
      description: p.description,
      bestseller: p.bestseller || false
    }));

    // Available categories
    const categories = [...new Set(products.map(p => p.category))];
    const subCategories = [...new Set(products.map(p => p.subCategory))];

    // System Prompt (USED PROPERLY)
    const systemPrompt = `You are "ToyJoy AI" — a friendly, knowledgeable toy advisor for parents shopping on ToyJoy.

Help parents find toys based on age, interest, budget, and occasion.
Be friendly and use emojis.

PRODUCT CATALOG:
${JSON.stringify(productCatalog, null, 2)}

AVAILABLE CATEGORIES: ${categories.join(", ")}
AVAILABLE SUB-CATEGORIES: ${subCategories.join(", ")}

Respond ONLY in JSON:
{
  "reply": "message with emoji",
  "filter": { "category": "", "subCategory": "" }
}`;

    // Get conversation history
    if (!conversations.has(sessionId)) {
      conversations.set(sessionId, []);
    }
    const history = conversations.get(sessionId);

    // ✅ CREATE MODEL FIRST
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: {
        role: "system",
        parts: [{ text: systemPrompt }]
      }
    });

    // ✅ THEN START CHAT
    const chat = model.startChat({
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      }))
    });

    // Send user message
    const result = await chat.sendMessage(userMessage);
    const responseText = result.response.text();

    // Save conversation
    history.push({ role: "user", text: userMessage });
    history.push({ role: "model", text: responseText });

    // Keep only last 20 messages
    if (history.length > 20) {
      history.splice(0, history.length - 20);
    }

    // Parse JSON safely
    let parsed;
    try {
      let clean = responseText.trim();
      if (clean.startsWith("```")) {
        clean = clean.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
      }
      parsed = JSON.parse(clean);
    } catch {
      parsed = {
        reply: responseText,
        filter: { category: "", subCategory: "" }
      };
    }

    res.json({
      reply: parsed.reply || "Here are some great toys for you! 🧸",
      filter: parsed.filter || { category: "", subCategory: "" }
    });

  } catch (error) {
    console.log("Chat API Error:", error);
    res.json({
      reply: "⚠️ ToyJoy AI is busy right now. Please try again soon! 🧸",
      filter: { category: "", subCategory: "" }
    });
  }
});

export default router;