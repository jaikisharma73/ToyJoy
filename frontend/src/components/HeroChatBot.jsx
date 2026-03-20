import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";

export default function HeroChatbot() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId] = useState(() => Math.random().toString(36).substring(2));
  const { setAiFilter, backendUrl } = useContext(ShopContext);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  const suggestions = [
    "🎯 Toys for 5 year old boy",
    "🎨 Educational gifts for girls",
    "⚽ Outdoor play toys",
    "🧩 Building toys for kids",
  ];

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, isTyping]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Add welcome message on first open
  useEffect(() => {
    if (isOpen && chat.length === 0) {
      setChat([
        {
          sender: "bot",
          text: "Hi! 👋 I'm ToyJoy AI — your personal toy advisor! Tell me about your child's age, interests, or what occasion you're shopping for, and I'll find the perfect toy! 🧸✨",
        },
      ]);
    }
  }, [isOpen]);

  const sendMessage = async (customMsg) => {
    const msgText = customMsg || message;
    if (!msgText.trim()) return;

    const userMsg = { sender: "user", text: msgText };
    setChat((prev) => [...prev, userMsg]);
    setMessage("");
    setIsTyping(true);

    try {
      const res = await axios.post(backendUrl + "/api/chat", {
        message: msgText,
        sessionId: sessionId,
      });

      if (res.data && res.data.reply) {
        const botMsg = { sender: "bot", text: res.data.reply };
        setChat((prev) => [...prev, botMsg]);

        // Apply AI filter to collection
        if (res.data.filter) {
          const { category, subCategory } = res.data.filter;
          if (category || subCategory) {
            setAiFilter({ category: category || "", subCategory: subCategory || "" });
          }
        }
      } else {
        throw new Error("Invalid response");
      }
    } catch (error) {
      console.error("Chatbot API Error:", error);
      const errorMsg = {
        sender: "bot",
        text: "🤖 Oops! I'm having a little trouble right now. Please try again in a moment!",
      };
      setChat((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        id="chatbot-toggle"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 1000,
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 8px 32px rgba(102, 126, 234, 0.4)",
          transition: "all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
          transform: isOpen ? "scale(0)" : "scale(1)",
          opacity: isOpen ? 0 : 1,
        }}
        onMouseEnter={(e) => {
          if (!isOpen) e.currentTarget.style.transform = "scale(1.1)";
        }}
        onMouseLeave={(e) => {
          if (!isOpen) e.currentTarget.style.transform = "scale(1)";
        }}
      >
        <span style={{ fontSize: "28px", lineHeight: 1 }}>🤖</span>
        {/* Pulse ring */}
        <span
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            border: "3px solid rgba(102, 126, 234, 0.6)",
            animation: "chatPulse 2s infinite",
          }}
        />
      </button>

      {/* Chat Panel */}
      <div
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 999,
          width: isOpen ? "380px" : "0px",
          maxWidth: "calc(100vw - 48px)",
          height: isOpen ? "560px" : "0px",
          maxHeight: "calc(100vh - 100px)",
          borderRadius: "20px",
          overflow: "hidden",
          transition: "all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? "translateY(0) scale(1)" : "translateY(20px) scale(0.9)",
          display: "flex",
          flexDirection: "column",
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.2)",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "12px",
                background: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "22px",
              }}
            >
              🧸
            </div>
            <div>
              <div
                style={{
                  color: "white",
                  fontWeight: 700,
                  fontSize: "16px",
                  letterSpacing: "0.3px",
                }}
              >
                ToyJoy AI
              </div>
              <div
                style={{
                  color: "rgba(255,255,255,0.8)",
                  fontSize: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <span
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "#4ade80",
                    display: "inline-block",
                  }}
                />
                Online • Your Toy Advisor
              </div>
            </div>
          </div>
          <button
            id="chatbot-close"
            onClick={() => setIsOpen(false)}
            style={{
              background: "rgba(255,255,255,0.15)",
              border: "none",
              color: "white",
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.25)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.15)")}
          >
            ✕
          </button>
        </div>

        {/* Chat Messages */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            background: "linear-gradient(180deg, #f8f9ff 0%, #ffffff 100%)",
          }}
        >
          {chat.map((msg, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
                animation: "msgSlideIn 0.3s ease-out",
              }}
            >
              {msg.sender === "bot" && (
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #667eea, #764ba2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "14px",
                    flexShrink: 0,
                    marginRight: "8px",
                    marginTop: "2px",
                  }}
                >
                  🤖
                </div>
              )}
              <div
                style={{
                  maxWidth: "75%",
                  padding: "10px 14px",
                  borderRadius:
                    msg.sender === "user"
                      ? "16px 16px 4px 16px"
                      : "16px 16px 16px 4px",
                  background:
                    msg.sender === "user"
                      ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                      : "white",
                  color: msg.sender === "user" ? "white" : "#1e293b",
                  fontSize: "13.5px",
                  lineHeight: "1.5",
                  boxShadow:
                    msg.sender === "user"
                      ? "0 4px 12px rgba(102, 126, 234, 0.3)"
                      : "0 2px 8px rgba(0, 0, 0, 0.06)",
                  wordBreak: "break-word",
                }}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #667eea, #764ba2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                  flexShrink: 0,
                }}
              >
                🤖
              </div>
              <div
                style={{
                  background: "white",
                  padding: "10px 16px",
                  borderRadius: "16px 16px 16px 4px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
                  display: "flex",
                  gap: "4px",
                  alignItems: "center",
                }}
              >
                <span style={{ animation: "dotBounce 1.4s infinite 0s" }} className="typing-dot" />
                <span style={{ animation: "dotBounce 1.4s infinite 0.2s" }} className="typing-dot" />
                <span style={{ animation: "dotBounce 1.4s infinite 0.4s" }} className="typing-dot" />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Suggestion Chips */}
        {chat.length <= 1 && (
          <div
            style={{
              padding: "0 16px 8px",
              display: "flex",
              flexWrap: "wrap",
              gap: "6px",
              background: "white",
            }}
          >
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => sendMessage(s.replace(/^[^\s]+\s/, ""))}
                style={{
                  background: "linear-gradient(135deg, rgba(102,126,234,0.08), rgba(118,75,162,0.08))",
                  border: "1px solid rgba(102,126,234,0.2)",
                  borderRadius: "20px",
                  padding: "6px 12px",
                  fontSize: "12px",
                  color: "#667eea",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "linear-gradient(135deg, #667eea, #764ba2)";
                  e.currentTarget.style.color = "white";
                  e.currentTarget.style.borderColor = "transparent";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "linear-gradient(135deg, rgba(102,126,234,0.08), rgba(118,75,162,0.08))";
                  e.currentTarget.style.color = "#667eea";
                  e.currentTarget.style.borderColor = "rgba(102,126,234,0.2)";
                }}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input Area */}
        <div
          style={{
            padding: "12px 16px",
            borderTop: "1px solid rgba(0,0,0,0.06)",
            display: "flex",
            gap: "8px",
            alignItems: "center",
            background: "white",
            flexShrink: 0,
          }}
        >
          <input
            id="chatbot-input"
            ref={inputRef}
            type="text"
            placeholder="Ask about toys for your child..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{
              flex: 1,
              border: "2px solid rgba(102,126,234,0.15)",
              borderRadius: "12px",
              padding: "10px 14px",
              fontSize: "13.5px",
              outline: "none",
              transition: "border-color 0.2s",
              background: "#f8f9ff",
            }}
            onFocus={(e) => (e.target.style.borderColor = "rgba(102,126,234,0.5)")}
            onBlur={(e) => (e.target.style.borderColor = "rgba(102,126,234,0.15)")}
          />
          <button
            id="chatbot-send"
            onClick={() => sendMessage()}
            disabled={!message.trim() || isTyping}
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "12px",
              border: "none",
              background:
                message.trim() && !isTyping
                  ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  : "#e2e8f0",
              color: "white",
              cursor: message.trim() && !isTyping ? "pointer" : "default",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
              transition: "all 0.2s",
              flexShrink: 0,
            }}
          >
            ➤
          </button>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes chatPulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0; }
          100% { transform: scale(1.4); opacity: 0; }
        }
        @keyframes msgSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes dotBounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }
        .typing-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #667eea;
          display: inline-block;
        }
      `}</style>
    </>
  );
}