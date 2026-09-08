import  { useState, useEffect, useRef } from "react";
import axios from "axios";

import {
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  Loader2,
  Sparkles,
  ShoppingBag,
} from "lucide-react";

const NexusCartChatbot = () => {
  // ==========================================
  // STATES
  // ==========================================

  const [isOpen, setIsOpen] = useState(false);

  const [input, setInput] = useState("");

  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Namaste! Main NexusCart AI Assistant hoon. Main aapki shopping aur products dhoondhne me kya madad kar sakta hoon?",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);

  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  // Persistent Session ID
  const sessionIdRef = useRef(null);

  // ==========================================
  // GET SESSION ID
  // ==========================================

  const getSessionId = () => {
    // Agar session already memory mein hai
    if (sessionIdRef.current) {
      return sessionIdRef.current;
    }

    // LocalStorage se check karo
    let sessionId = localStorage.getItem(
      "nexuscart_ai_session",
    );

    // Agar nahi mila to naya UUID create karo
    if (!sessionId) {
      sessionId = crypto.randomUUID();

      localStorage.setItem(
        "nexuscart_ai_session",
        sessionId,
      );
    }

    // Ref mein store karo
    sessionIdRef.current = sessionId;

    return sessionId;
  };

  // ==========================================
  // AUTO SCROLL
  // ==========================================

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, loading]);

  // ==========================================
  // SEND MESSAGE
  // ==========================================

  const handleSend = async (customMessage = null) => {
    const queryText = (customMessage || input).trim();

    // Empty message ya already loading
    if (!queryText || loading) return;

    const userTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    // ==========================================
    // ADD USER MESSAGE
    // ==========================================

    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: queryText,
        time: userTime,
      },
    ]);

    // Input clear
    if (!customMessage) {
      setInput("");
    }

    setLoading(true);

    try {
      // ==========================================
      // CALL EXPRESS AI PROXY
      // ==========================================

      const response = await axios.post(
        "http://localhost:8000/api/v1/ai/chat",
        {
          message: queryText,

          session_id: getSessionId(),
        },
        {
          withCredentials: true,
        },
      );

      const aiTime = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      // ==========================================
      // SUCCESS RESPONSE
      // ==========================================

      if (response.data?.success) {
        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            text:
              response.data.message ||
              "Mujhe koi response nahi mila.",
            time: aiTime,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            text:
              response.data?.message ||
              "Kuch issue aa gaya hai. Kripya dubara try karein.",
            time: aiTime,
          },
        ]);
      }
    } catch (error) {
      console.error(
        "Chat error:",
        error.response?.data || error.message,
      );

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",

          text:
            error.response?.data?.message ||
            "Server connection fail ho gaya. Please check backend connection.",

          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // QUICK PROMPTS
  // ==========================================

  const quickPrompts = [
    "I need a gaming keyboard",
    "Nike running shoes dikhao",
    "Is se sasta wala dikhao",
  ];

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      
      {/* ========================================== */}
      {/* FLOATING BUTTON */}
      {/* ========================================== */}

      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 group"
        >
          <Sparkles className="w-6 h-6 animate-pulse text-yellow-300" />

          <span className="font-semibold pr-1 hidden sm:inline">
            Ask AI
          </span>

          <MessageSquare className="w-6 h-6" />
        </button>
      )}

      {/* ========================================== */}
      {/* CHAT WINDOW */}
      {/* ========================================== */}

      {isOpen && (
        <div className="w-[90vw] sm:w-[380px] h-[520px] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden transition-all duration-300">

          {/* HEADER */}

          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-4 text-white flex items-center justify-between shadow-md">

            <div className="flex items-center gap-3">

              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>

              <div>
                <h3 className="font-bold text-base tracking-wide flex items-center gap-1.5">
                  NexusCart AI

                  <span className="w-2 h-2 rounded-full bg-green-400 inline-block animate-pulse" />
                </h3>

                <p className="text-xs text-blue-100">
                  Smart Shopping Assistant
                </p>
              </div>

            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors text-white/90 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

          </div>

          {/* ========================================== */}
          {/* CHAT MESSAGES */}
          {/* ========================================== */}

          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50/50">

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-2.5 ${
                  msg.sender === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >

                {/* AI ICON */}

                {msg.sender === "ai" && (
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-sm mt-1">

                    <Bot className="w-4 h-4" />

                  </div>
                )}

                {/* MESSAGE */}

                <div
                  className={`max-w-[80%] rounded-2xl p-3.5 shadow-sm text-sm whitespace-pre-wrap leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-indigo-600 text-white rounded-br-none"
                      : "bg-white text-gray-800 border border-gray-100 rounded-bl-none"
                  }`}
                >

                  {msg.text}

                  <div
                    className={`text-[10px] mt-1.5 text-right ${
                      msg.sender === "user"
                        ? "text-indigo-200"
                        : "text-gray-400"
                    }`}
                  >
                    {msg.time}
                  </div>

                </div>

                {/* USER ICON */}

                {msg.sender === "user" && (
                  <div className="w-7 h-7 rounded-lg bg-gray-800 flex items-center justify-center text-white shrink-0 shadow-sm mt-1">

                    <User className="w-4 h-4" />

                  </div>
                )}

              </div>
            ))}

            {/* ========================================== */}
            {/* AI LOADING */}
            {/* ========================================== */}

            {loading && (
              <div className="flex gap-2.5 justify-start items-center">

                <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white shrink-0">

                  <Bot className="w-4 h-4" />

                </div>

                <div className="bg-white p-3 rounded-2xl rounded-bl-none border border-gray-100 shadow-sm flex items-center gap-2 text-xs text-gray-500">

                  <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />

                  NexusCart AI soche raha hai...

                </div>

              </div>
            )}

            {/* AUTO SCROLL TARGET */}

            <div ref={messagesEndRef} />

          </div>

          {/* ========================================== */}
          {/* QUICK PROMPTS */}
          {/* ========================================== */}

          <div className="px-3 py-2 bg-gray-100/60 border-t border-gray-100 flex gap-1.5 overflow-x-auto no-scrollbar">

            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSend(prompt)}
                disabled={loading}
                className="text-xs text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/60 px-2.5 py-1 rounded-full whitespace-nowrap transition-colors shrink-0 disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}

          </div>

          {/* ========================================== */}
          {/* INPUT */}
          {/* ========================================== */}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-gray-100 flex items-center gap-2"
          >

            <input
              type="text"
              placeholder="Aapko kya khareedna hai?..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              className="flex-1 bg-gray-100 text-gray-800 text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all disabled:opacity-50"
            />

            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl disabled:opacity-40 transition-all duration-200 shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>

          </form>

        </div>
      )}

    </div>
  );
};

export default NexusCartChatbot;