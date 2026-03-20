// HeroChatbot.jsx
import { useState } from "react";
import axios from "axios";
import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";

export default function HeroChatbot() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const { setAiFilter, backendUrl } = useContext(ShopContext);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const lowerMsg = message.toLowerCase();

    // 🎯 CONTROL COLLECTION FILTER
    if (lowerMsg.includes("outdoor")) {
      setAiFilter("outdoor");
    }
    else if (lowerMsg.includes("indoor")) {
      setAiFilter("indoor");
    }
    else if (lowerMsg.includes("educational")) {
      setAiFilter("educational");
    }
    else if (lowerMsg.includes("building")) {
      setAiFilter("building");
    }

    const userMsg = { sender: "user", text: message };
    setChat(prev => [...prev, userMsg]);
    setMessage("");
    setIsTyping(true);

    try {
      // Use dynamic backendUrl instead of hardcoded localhost
      const res = await axios.post(backendUrl + "/api/chat", { message: lowerMsg });

      if (res.data && res.data.reply) {
        const botMsg = { sender: "bot", text: res.data.reply };
        setChat(prev => [...prev, botMsg]);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Chatbot API Error:", error);
      const errorMsg = { sender: "bot", text: "🤖 Sorry, I'm having trouble connecting to my brain right now. Please try again later!" };
      setChat(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className=" flex items-center justify-center my-2">
    <div className="bg-white/90 backdrop-blur-md p-5 rounded-xl shadow-lg w-full max-w-md">
      <h2 className="text-lg font-semibold mb-2">🤖 Ask ToyJoy AI</h2>

      <div className="h-52 overflow-y-auto mb-3 border rounded p-2 bg-gray-50">
        {chat.map((msg, i) => (
          <div key={i} className={`my-2 text-sm ${msg.sender === "user" ? "text-right" : "text-left"}`}>
            <span className={msg.sender === "user" ? "bg-blue-500 text-white px-3 py-1 rounded-lg" : "bg-gray-200 px-3 py-1 rounded-lg"}>
              {msg.text}
            </span>
          </div>
        ))}
        {isTyping && (
          <div className="text-left my-2 text-xs text-gray-400">
            🤖 Thinking...
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="My child is 7 and loves art"
          className="flex-1 border rounded px-3 py-2 text-sm"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage} className="bg-black text-white px-4 rounded">
          Send
        </button>
      </div>
    </div>
    </div>
  );
}