import { useState, useRef, useEffect } from "react";
import { Send, Bot, User } from "lucide-react";
import { sendMessage } from "../services/api";
import { useForm } from "../context/useForm";
import ChatMessage from "./ChatMessage";

export default function AIAssistant() {
  const { setFormData } = useForm();

  const [messages, setMessages] = useState([
    {
      role: "ai",
      data: "Hello! I'm your AI Medical Affairs Assistant. How can I help you today?",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { role: "user", data: userMessage }]);
    setInput("");
    setLoading(true);

    try {
      const res = await sendMessage(userMessage);
      const data = res.data;

      setMessages((prev) => [...prev, { role: "ai", data }]);

      if (data.type === "log") {
        setFormData((prev) => ({
          ...prev,
          hcp_name: data.hcp_name || prev.hcp_name || "",
          notes: data.notes || prev.notes || "",
          product: data.product || prev.product || "",
          disease_area: data.disease_area || prev.disease_area || "",
          sentiment: data.sentiment || prev.sentiment || "neutral",
        }));
      }
    } catch (err) {
      console.error("AI Error:", err);
      setMessages((prev) => [
        ...prev,
        { role: "ai", data: "Sorry, I couldn't process your request. Please try again." },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
      {/* Simple Dark Header */}
      {/* <div className="bg-zinc-900 px-6 py-5 border-b border-zinc-800 flex items-center gap-4">
        <div className="w-10 h-10 bg-zinc-800 rounded-2xl flex items-center justify-center">
          <Bot className="w-6 h-6 text-violet-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">AI Medical Assistant</h2>
          <p className="text-zinc-500 text-sm">Always here to help</p>
        </div>
      </div> */}

      {/* Messages Area */}
      <div className="flex-1 p-6 overflow-y-auto bg-zinc-950 space-y-7">
        {messages.map((msg, i) => (
          <ChatMessage 
            key={i} 
            role={msg.role} 
            data={msg.data} 
          />
        ))}

        {loading && (
          <div className="flex items-start gap-4">
            <div className="w-9 h-9 bg-zinc-800 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Bot className="w-5 h-5 text-violet-400" />
            </div>
            <div className="bg-zinc-900 rounded-3xl rounded-tl-none px-6 py-4 text-zinc-300">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce delay-150" />
                <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce delay-300" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Simple Dark Input Area */}
      <div className="p-6 border-t border-zinc-800 bg-zinc-900">
        <div className="flex gap-3">
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-zinc-900 border border-zinc-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 rounded-2xl px-5 py-4 text-white placeholder-zinc-500 text-base outline-none transition-all"
            placeholder="Type your message... (e.g., Log interaction with Dr. Sharma)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />

          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-violet-600 hover:bg-violet-500 disabled:bg-zinc-700 text-white px-8 rounded-2xl flex items-center justify-center transition-all active:scale-95 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

        <p className="text-center text-zinc-600 text-xs mt-4">
          Press Enter to send • AI can log interactions automatically
        </p>
      </div>
    </div>
  );
}
