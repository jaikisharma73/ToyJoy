import express from "express";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const userMessage = req.body.message.toLowerCase();

    let reply = "🧸 Here are some great toy suggestions for kids!";

    if (userMessage.includes("art") || userMessage.includes("craft") || userMessage.includes("educational")) {
      reply = "🎨 Art & Craft Kits, DIY Painting Sets, Coloring Books, and Clay Modeling Kits boost creativity.";
    }
    else if (userMessage.includes("science") || userMessage.includes("stem") || userMessage.includes("indoor")) {
      reply = "🔬 STEM Kits, Robotics Toys, Coding Games, and Science Experiment Labs are perfect for smart learners.";
    }
    else if (userMessage.includes("baby") || userMessage.includes("toddler")) {
      reply = "🍼 Soft Toys, Musical Toys, Rattles, and Activity Walkers are safe and fun for toddlers.";
    }
    else if (userMessage.includes("5") || userMessage.includes("building") || userMessage.includes("7")) {
      reply = "🧩 Building Blocks, Learning Puzzles, Story Books, and Educational Board Games are ideal for this age.";
    }
    else if (userMessage.includes("sugget me a gift") || userMessage.includes("gift for birthday")) {
      reply = "🎁 Remote Control Cars, Doll Houses, Train Sets, and Fun Board Games make exciting gifts for kids.";
    }
    else if (userMessage.includes("outdoor")) {
      reply = "⚽ Outdoor Sports Toys, Cricket Sets, Footballs, Skipping Ropes, and Ride-On Cars keep kids active.";
    }
    else if (userMessage.includes("girl")) {
      reply = "👧 Doll Houses, Kitchen Play Sets, Barbie Dolls, Soft Toys, and Art Kits are popular among girls.";
    }
    else if (userMessage.includes("boy")) {
      reply = "👦 Remote Control Cars, Action Figures, Superhero Toys, Racing Tracks, and Building Sets are popular among boys.";
    }

    res.json({ reply });

  } catch (error) {
    console.log(error);
    res.json({ reply: "⚠️ Server busy. Please try again." });
  }
});

export default router;