import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  
  X,
  Send,
  Bot,
  User,
  Loader2,
  Sparkles,
  ShoppingBag,
} from "lucide-react";

const AIShoppingAssistant = () => {
  const navigate = useNavigate();

  // ==========================================
  // STATES
  // ==========================================

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");

  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Namaste! Main NexusCart ka AI concierge hoon. Bataiye, aaj aapke liye kya dhoondhna hai?",
      products: [],
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);

  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const sessionIdRef = useRef(null);

  // ==========================================
  // GET SESSION ID
  // ==========================================

  const getSessionId = () => {
    if (sessionIdRef.current) {
      return sessionIdRef.current;
    }

    let sessionId = localStorage.getItem("nexuscart_ai_session");

    if (!sessionId) {
      sessionId = crypto.randomUUID();
      localStorage.setItem("nexuscart_ai_session", sessionId);
    }

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

    if (!queryText || loading) return;

    const userTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: queryText,
        products: [],
        time: userTime,
      },
    ]);

    if (!customMessage) {
      setInput("");
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/ai/chat",
        {
          message: queryText,
          session_id: getSessionId(),
        },
        {
          withCredentials: true,
        }
      );

      const aiTime = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      if (response.data?.success) {
        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            text:
              response.data.message ||
              "Mujhe koi response nahi mila.",
            products: response.data.products || [],
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
            products: [],
            time: aiTime,
          },
        ]);
      }
    } catch (error) {
      console.error(
        "Chat error:",
        error.response?.data || error.message
      );

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text:
            error.response?.data?.message ||
            "Server connection fail ho gaya. Please check backend connection.",
          products: [],
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
  // VIEW PRODUCT DETAILS
  // ==========================================

  const handleViewDetails = (productId) => {
    if (!productId) return;

    setIsOpen(false);

    // Agar aapka route /products/:id hai toh '/products/' rakhein
    // Agar /product/:id hai toh '/product/' rakhein
    navigate(`/products/${productId}`);
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600;700&display=swap');
        .nxc-serif { font-family: 'Fraunces', serif; }
        .nxc-sans { font-family: 'Inter', sans-serif; }
        .nxc-scroll::-webkit-scrollbar { width: 5px; }
        .nxc-scroll::-webkit-scrollbar-track { background: transparent; }
        .nxc-scroll::-webkit-scrollbar-thumb { background: #4A4358; border-radius: 4px; }
        @keyframes nxc-rise {
          from { opacity: 0; transform: translateY(14px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .nxc-panel-enter { animation: nxc-rise 0.28s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes nxc-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(198,161,91,0.35); }
          50% { box-shadow: 0 0 0 8px rgba(198,161,91,0); }
        }
        .nxc-glow { animation: nxc-glow 2.6s ease-out infinite; }
      `}</style>

      {/* FLOATING BUTTON */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="nxc-glow nxc-sans flex items-center gap-2.5 bg-[#14121B] hover:bg-[#1C1926] text-[#F4F1EA] pl-4 pr-5 py-3.5 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.35)] border border-[#C6A15B]/30 transition-all duration-300 hover:-translate-y-0.5"
        >
          <span className="w-7 h-7 rounded-full bg-[#C6A15B]/15 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-[#C6A15B]" />
          </span>
          <span className="font-medium text-sm hidden sm:inline">
            Ask NexusCart AI
          </span>
        </button>
      )}

      {/* CHAT WINDOW */}
      {isOpen && (
        <div className="nxc-panel-enter nxc-sans w-[92vw] sm:w-[390px] h-[560px] bg-[#14121B] rounded-[20px] shadow-[0_20px_60px_rgba(0,0,0,0.45)] border border-[#2A2438] flex flex-col overflow-hidden">
          {/* HEADER */}
          <div className="relative px-5 py-4 bg-gradient-to-b from-[#1D1929] to-[#14121B] border-b border-[#C6A15B]/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#C6A15B]/12 border border-[#C6A15B]/30 flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4 text-[#C6A15B]" />
                </div>

                <div>
                  <h3 className="nxc-serif text-[#F4F1EA] text-[17px] font-medium tracking-wide leading-tight flex items-center gap-2">
                    NexusCart
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80" />
                  </h3>
                  <p className="text-[11px] text-[#9A93A8] mt-0.5">
                    Your personal shopping concierge
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/5 rounded-full transition-colors text-[#9A93A8] hover:text-[#F4F1EA]"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>

          {/* CHAT MESSAGES */}
          <div className="nxc-scroll flex-1 px-4 py-4 overflow-y-auto space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-2.5 ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {/* AI ICON */}
                {msg.sender === "ai" && (
                  <div className="w-7 h-7 rounded-full bg-[#221E2B] border border-[#C6A15B]/25 flex items-center justify-center text-[#C6A15B] shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                {/* MESSAGE */}
                <div
                  className={`max-w-[82%] rounded-2xl px-4 py-3 text-[13px] whitespace-pre-wrap leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-[#C6A15B] text-[#14121B] font-medium rounded-br-md"
                      : "bg-[#1C1926] text-[#E4E1EA] border border-[#2A2438] rounded-bl-md"
                  }`}
                >
                  {msg.text}

                  {/* PRODUCT CARDS */}
                  {msg.sender === "ai" &&
                    msg.products &&
                    msg.products.length > 0 && (
                      <div className="mt-3 space-y-2.5">
                        {msg.products.map((product) => {
                          const pId = product.id || product._id;
                          return (
                            <div
                              key={pId}
                              className="bg-[#14121B] border border-[#2A2438] rounded-xl p-3.5 hover:border-[#C6A15B]/40 transition-colors"
                            >
                              <h4 className="nxc-serif text-[#F4F1EA] text-[14px] font-medium leading-snug">
                                {product.name}
                              </h4>

                              <div className="flex items-center justify-between mt-2">
                                <p className="text-[#C6A15B] font-semibold text-[15px]">
                                  ₹{product.price}
                                </p>
                                <p className="text-[10.5px] text-[#9A93A8]">
                                  {product.category}
                                </p>
                              </div>

                              {product.description && (
                                <p className="text-[11.5px] text-[#9A93A8] mt-2 line-clamp-2">
                                  {product.description}
                                </p>
                              )}

                              {typeof product.stock !== "undefined" && (
                                <p className="text-[11px] text-emerald-400/90 mt-2">
                                  In stock · {product.stock} available
                                </p>
                              )}

                              <button
                                onClick={() => handleViewDetails(pId)}
                                className="mt-3 w-full bg-transparent hover:bg-[#C6A15B]/10 active:scale-[0.98] text-[#C6A15B] border border-[#C6A15B]/40 text-[11.5px] font-medium py-2 rounded-lg transition-all"
                              >
                                View details
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}

                  {/* TIME */}
                  <div
                    className={`text-[9.5px] mt-1.5 text-right ${
                      msg.sender === "user"
                        ? "text-[#14121B]/60"
                        : "text-[#6E6980]"
                    }`}
                  >
                    {msg.time}
                  </div>
                </div>

                {/* USER ICON */}
                {msg.sender === "user" && (
                  <div className="w-7 h-7 rounded-full bg-[#2A2438] border border-[#3A3348] flex items-center justify-center text-[#E4E1EA] shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {/* AI LOADING */}
            {loading && (
              <div className="flex gap-2.5 justify-start items-center">
                <div className="w-7 h-7 rounded-full bg-[#221E2B] border border-[#C6A15B]/25 flex items-center justify-center text-[#C6A15B] shrink-0">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="bg-[#1C1926] px-4 py-3 rounded-2xl rounded-bl-md border border-[#2A2438] flex items-center gap-2 text-[11.5px] text-[#9A93A8]">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#C6A15B]" />
                  NexusCart AI soch raha hai...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* QUICK PROMPTS */}
          <div className="px-4 py-3 border-t border-[#2A2438] flex gap-2 overflow-x-auto no-scrollbar">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSend(prompt)}
                disabled={loading}
                className="text-[11.5px] text-[#E4E1EA] bg-[#1C1926] hover:bg-[#221E2B] border border-[#2A2438] hover:border-[#C6A15B]/40 px-3 py-1.5 rounded-full whitespace-nowrap transition-colors shrink-0 disabled:opacity-40"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* INPUT FORM */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3.5 bg-[#14121B] border-t border-[#2A2438] flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Aapko kya khareedna hai?"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              className="flex-1 bg-[#1C1926] text-[#F4F1EA] placeholder:text-[#6E6980] text-[13px] rounded-xl px-4 py-2.5 border border-[#2A2438] focus:outline-none focus:border-[#C6A15B]/50 transition-all disabled:opacity-50"
            />

            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2.5 bg-[#C6A15B] hover:bg-[#D4B276] text-[#14121B] rounded-xl disabled:opacity-30 transition-all duration-200 shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AIShoppingAssistant;