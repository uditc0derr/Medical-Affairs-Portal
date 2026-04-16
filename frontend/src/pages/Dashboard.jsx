import InteractionForm from "../components/InteractionForm";
import AIAssistant from "../components/AIAssistant";
import { UserPlus, Bot } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <div className="h-16 bg-white border-b flex items-center px-8 justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 text-white rounded-2xl flex items-center justify-center">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Medical Affairs Portal</h1>
              <p className="text-xs text-gray-500 -mt-1">Log HCP Interactions</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div className="px-4 py-1.5 bg-gray-100 rounded-full text-gray-600">
              Dehradun, IN
            </div>
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
          </div>
        </div>

        {/* Form Area */}
        <div className="flex-1 p-8 overflow-y-auto bg-white">
          <div className="max-w-2xl mx-auto">
            <InteractionForm />
          </div>
        </div>
      </div>

      {/* AI Assistant Sidebar */}
      <div className="w-[420px] border-l bg-gray-50 flex flex-col overflow-hidden shadow-inner">
        {/* Sidebar Header */}
        <div className="h-16 bg-white border-b flex items-center px-6 gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-indigo-500 text-white rounded-2xl flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">AI Assistant</h2>
            <p className="text-xs text-emerald-600 font-medium">● Online • Ready to help</p>
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