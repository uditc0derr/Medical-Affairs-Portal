import { useState, useRef, useEffect } from "react";
import { Send, Bot, User } from "lucide-react";
import { sendMessage } from "../services/api";
import { useForm } from "../context/FormContext";
import ChatMessage from "./ChatMessage";

export default function AIAssistant() {
  const { setFormData } = useForm();
  
  const [messages, setMessages] = useState([
    {
      role: "ai",
      data: "Hello! I'm your AI Medical Affairs Assistant. How can I help you today? You can ask me to log an interaction or answer any questions."
    }
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

      console.log("AI RESPONSE:", data);


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
        {
          role: "ai",
          data: "Sorry, I couldn't process your request. Please try again."
        }
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
    <div className="flex flex-col h-full bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-5 text-white flex items-center gap-3">
        <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
          <Bot className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">AI Medical Assistant</h2>
          <p className="text-violet-100 text-sm">Powered by AI • Always ready to help</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-gray-50">
        {messages.map((msg, i) => (
          <ChatMessage 
            key={i} 
            role={msg.role} 
            data={msg.data} 
          />
        ))}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-violet-100 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Bot className="w-5 h-5 text-violet-600" />
            </div>
            <div className="bg-white rounded-3xl rounded-tl-none px-5 py-3 text-gray-600 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce delay-150" />
                <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce delay-300" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 border-t bg-white">
        <div className="flex gap-3">
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-gray-50 border border-gray-200 focus:border-violet-500 focus:ring-violet-500 rounded-2xl px-5 py-4 text-base placeholder-gray-400 transition-all outline-none"
            placeholder="Type your message... (e.g., Log interaction with Dr. Sharma about diabetes)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />

          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 text-white px-7 rounded-2xl flex items-center justify-center transition-all shadow-lg shadow-violet-500/30 disabled:shadow-none"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

        <p className="text-center text-[10px] text-gray-400 mt-3">
          Press Enter to send • AI can help you log interactions
        </p>
      </div>
    </div>
  );
}