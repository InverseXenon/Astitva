import React, { useState, useEffect } from "react";
import apiService from "../services/api";
import { Sparkles, Heart, Send, X } from "lucide-react";

const FloatingChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [hasWelcomed, setHasWelcomed] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const toggleChat = () => {
    // Add click animation
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 200);
    
    setIsOpen(!isOpen);
    
    // Add welcome message on first open
    if (!isOpen && !hasWelcomed) {
      setTimeout(() => {
        setChatHistory([{
          sender: "bot",
          text: "🌸 Namaste! I'm Sakhi, your empowerment companion. I'm here to help you with career guidance, health questions, legal rights, safety tips, and more. How can I support you today?",
          id: Date.now()
        }]);
        setHasWelcomed(true);
      }, 500);
    }
  };

  const handleSend = async () => {
    if (!query.trim()) return;

    // Add user message
    const userMessage = { sender: "user", text: query, id: Date.now() };
    setChatHistory(prev => [...prev, userMessage]);
    const tempQuery = query;
    setQuery("");

    try {
      setIsBotTyping(true);
      const res = await apiService.sendChatMessage(tempQuery);

      // Simulate typing delay
      setTimeout(() => {
        setChatHistory(prev => [...prev, {
          sender: "bot",
          text: res.response,
          id: Date.now() + 1
        }]);
        setIsBotTyping(false);
      }, 1200);

    } catch (error) {
      console.error("Chat error:", error);
      setChatHistory(prev => [...prev, {
        sender: "bot",
        text: "Let me regroup... Could you please rephrase? 💐",
        id: Date.now()
      }]);
      setIsBotTyping(false);
    }
  };

  // Auto-scroll to bottom
  useEffect(() => {
    const chatBody = document.getElementById("chat-body");
    if (chatBody) chatBody.scrollTop = chatBody.scrollHeight;
  }, [chatHistory, isBotTyping]);

  return (
    <div className="fixed bottom-4 right-4 z-[999] md:bottom-6 md:right-6">
      {/* Floating Action Button */}
      <button
        onClick={toggleChat}
        className={`relative bg-gradient-to-br from-fuchsia-600 to-pink-500 w-12 h-12 md:w-14 md:h-14 rounded-2xl 
        shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-105
        ${isOpen ? "rotate-90 shadow-pink-900/30" : "rotate-0 shadow-pink-900/20"}
        ${isClicked ? "scale-90 animate-pulse" : ""}`}
      >
        <Sparkles className="text-white w-5 h-5 md:w-6 md:h-6" />
        <div className="absolute -top-1 -right-1 bg-rose-500 text-white w-4 h-4 md:w-5 md:h-5 rounded-full 
                     flex items-center justify-center text-[10px] animate-pulse">
          <Heart className="w-2 h-2 md:w-2.5 md:h-2.5" />
        </div>
      </button>

      {/* Chat Interface */}
      <div className={`absolute bottom-16 right-0 w-72 h-[420px] md:w-80 md:h-[480px] md:bottom-20 
        transition-all duration-300 ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"}
        ${isOpen ? "max-h-[calc(100vh-120px)]" : ""}`}>
        
        <div className="h-full bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-fuchsia-600 to-pink-500 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-white/10 p-1.5 rounded-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Sakhi AI</h2>
                <p className="text-xs text-white/90 mt-0.5">Empowerment Companion</p>
              </div>
            </div>
            <button 
              onClick={toggleChat}
              className="text-white/80 hover:text-white p-1 -mr-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Messages */}
          <div 
            id="chat-body"
            className="h-[calc(100%-120px)] md:h-[calc(100%-136px)] p-2 md:p-3 space-y-2 md:space-y-3 overflow-y-auto 
                     scrollbar-thin scrollbar-thumb-pink-200 scrollbar-track-transparent"
          >
            {chatHistory.map((msg) => (
              <div 
                key={msg.id}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[85%] p-3 rounded-xl text-sm ${
                  msg.sender === "bot" 
                    ? "bg-pink-50/90 text-gray-700 shadow-sm"
                    : "bg-gradient-to-br from-pink-500 to-fuchsia-600 text-white"
                }`}>
                  <p className="leading-snug">{msg.text}</p>
                  <p className={`mt-1 text-[11px] ${
                    msg.sender === "bot" ? "text-pink-500" : "text-white/70"
                  }`}>
                    {msg.sender === "bot" ? "Sakhi" : "You"}
                  </p>
                </div>
              </div>
            ))}

            {isBotTyping && (
              <div className="flex items-center gap-1.5 text-pink-500 animate-pulse pl-2">
                <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-current rounded-full animate-bounce delay-75" />
                <div className="w-2 h-2 bg-current rounded-full animate-bounce delay-150" />
                <span className="text-xs ml-1.5">Sakhi is thinking...</span>
              </div>
            )}
          </div>

          {/* Input Section */}
          <div className="border-t border-pink-100 p-3 bg-white/95 backdrop-blur-lg">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask about health, rights, or support..."
                className="w-full pl-4 pr-12 py-2.5 text-sm rounded-lg border border-pink-100
                         focus:border-pink-300 focus:ring-1 focus:ring-pink-200
                         placeholder-pink-500/80 text-pink-900 bg-white"
              />
              <button
                onClick={handleSend}
                disabled={!query.trim()}
                className={`absolute right-1.5 top-1.5 p-1.5 rounded-lg transition-colors
                          ${query.trim() 
                            ? "bg-pink-500 hover:bg-pink-600 text-white"
                            : "bg-pink-100 text-pink-300 cursor-not-allowed"}`}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-center text-[11px] text-pink-500/80 mt-1.5">
              🌸 Powered by women's wisdom
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloatingChat;