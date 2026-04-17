import InteractionForm from "../components/InteractionForm";
import AIAssistant from "../components/AIAssistant";
import { UserPlus, Bot } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-zinc-950 overflow-hidden font-sans">
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Navbar - Dark */}
        <div className="h-16 bg-zinc-900 border-b border-zinc-800 flex items-center px-8 justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-violet-600 text-white rounded-2xl flex items-center justify-center">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white">Medical Affairs Portal</h1>
              <p className="text-xs text-zinc-500 -mt-1">Log HCP Interactions</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div className="px-4 py-1.5 bg-zinc-800 text-zinc-400 rounded-full border border-zinc-700">
              Meerut, Uttar Pradesh
            </div>
            <div className="w-8 h-8 bg-zinc-700 rounded-full flex items-center justify-center text-xs font-medium text-zinc-300">
              TR
            </div>
          </div>
        </div>

        {/* Form Area */}
        <div className="flex-1 p-8 overflow-y-auto bg-zinc-950">
          <div className="max-w-2xl mx-auto">
            <InteractionForm />
          </div>
        </div>
      </div>

      {/* AI Assistant Sidebar - Dark */}
      <div className="w-[420px] border-l border-zinc-800 bg-zinc-950 flex flex-col overflow-hidden">
        
        {/* Sidebar Header */}
        <div className="h-16 bg-zinc-900 border-b border-zinc-800 flex items-center px-6 gap-3">
          <div className="w-9 h-9 bg-zinc-800 rounded-2xl flex items-center justify-center">
            <Bot className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h2 className="font-semibold text-white">AI Medical Assistant</h2>
            <p className="text-xs text-emerald-500 font-medium flex items-center gap-1">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              Online • Ready to help
            </p>
          </div>
        </div>

        {/* AI Assistant Content */}
        <div className="flex-1 overflow-hidden">
          <AIAssistant />
        </div>
      </div>
    </div>
  );
}