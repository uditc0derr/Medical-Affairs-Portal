import { Bot, User, Search, Edit3, Lightbulb, FileText, ShieldAlert } from "lucide-react";

export default function ChatMessage({ role, data }) {
  // User Message (Right aligned - Dark theme)
  if (role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[75%] bg-zinc-800 text-white px-5 py-3.5 rounded-3xl rounded-br-none shadow-md border border-zinc-700">
          <p className="text-[15px] leading-relaxed">{data}</p>
        </div>
      </div>
    );
  }

  // Common classes for AI messages
  const baseClasses = "max-w-[80%] px-5 py-4 rounded-3xl rounded-bl-none shadow-sm border";

  // 🔍 SEARCH RESULTS
  if (data?.type === "search") {
    return (
      <div className="flex gap-3">
        <div className="w-9 h-9 bg-zinc-800 rounded-2xl flex items-center justify-center flex-shrink-0 mt-1">
          <Search className="w-5 h-5 text-violet-400" />
        </div>
        <div className={`${baseClasses} bg-zinc-900 border-zinc-700 text-zinc-200`}>
          <div className="flex items-center gap-2 mb-3">
            <Search className="w-4 h-4 text-violet-400" />
            <span className="font-semibold text-white">Search Results</span>
          </div>

          {data.results?.length === 0 ? (
            <p className="text-zinc-500 text-sm italic">No matching interactions found.</p>
          ) : (
            <div className="space-y-4">
              {data.results?.map((item, index) => (
                <div
                  key={index}
                  className="bg-zinc-800 border border-zinc-700 p-4 rounded-2xl"
                >
                  <p className="text-zinc-200 leading-relaxed">{item.notes}</p>
                  <div className="flex gap-3 mt-3 text-xs">
                    {item.product && (
                      <span className="bg-zinc-900 px-3 py-1 rounded-full border border-zinc-700 text-zinc-300">
                        💊 {item.product}
                      </span>
                    )}
                    {item.disease_area && (
                      <span className="bg-zinc-900 px-3 py-1 rounded-full border border-zinc-700 text-zinc-300">
                        🧬 {item.disease_area}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ✏️ EDIT / CONFIRMATION
  if (data?.type === "edit") {
    return (
      <div className="flex gap-3">
        <div className="w-9 h-9 bg-zinc-800 rounded-2xl flex items-center justify-center flex-shrink-0 mt-1">
          <Edit3 className="w-5 h-5 text-emerald-400" />
        </div>
        <div className={`${baseClasses} bg-zinc-900 border-emerald-900/50 text-emerald-300`}>
          <p className="font-medium">{data.notes || "Changes applied successfully"}</p>
        </div>
      </div>
    );
  }

  // 🎯 RECOMMENDATION
  if (data?.type === "recommendation") {
    return (
      <div className="flex gap-3">
        <div className="w-9 h-9 bg-zinc-800 rounded-2xl flex items-center justify-center flex-shrink-0 mt-1">
          <Lightbulb className="w-5 h-5 text-amber-400" />
        </div>
        <div className={`${baseClasses} bg-zinc-900 border-amber-900/50 text-zinc-200`}>
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <span className="font-semibold text-amber-300">Recommended Action</span>
          </div>
          <p className="leading-relaxed">{data.next_best_action}</p>
          {data.priority && (
            <p className="text-xs mt-3 text-amber-400 font-medium">
              Priority: <span className="capitalize">{data.priority}</span>
            </p>
          )}
        </div>
      </div>
    );
  }

  // 📊 SUMMARY
  if (data?.type === "summary") {
    return (
      <div className="flex gap-3">
        <div className="w-9 h-9 bg-zinc-800 rounded-2xl flex items-center justify-center flex-shrink-0 mt-1">
          <FileText className="w-5 h-5 text-purple-400" />
        </div>
        <div className={`${baseClasses} bg-zinc-900 border-purple-900/50 text-zinc-200`}>
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-purple-400" />
            <span className="font-semibold text-purple-300">Interaction Summary</span>
          </div>
          <p className="leading-relaxed">{data.summary}</p>
        </div>
      </div>
    );
  }

  // ⚖️ COMPLIANCE
  if (data?.type === "compliance") {
    return (
      <div className="flex gap-3">
        <div className="w-9 h-9 bg-zinc-800 rounded-2xl flex items-center justify-center flex-shrink-0 mt-1">
          <ShieldAlert className="w-5 h-5 text-red-400" />
        </div>
        <div className={`${baseClasses} bg-zinc-900 border-red-900/50 text-red-300`}>
          <div className="flex items-center gap-2 mb-3">
            <ShieldAlert className="w-4 h-4" />
            <span className="font-semibold text-red-300">Compliance Check</span>
          </div>
          
          <p className="font-medium">
            Status: <span className="capitalize">{data.compliance_status}</span>
          </p>

          {data.issues?.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2 text-red-400">Issues Found:</p>
              <ul className="space-y-1 text-sm">
                {data.issues.map((issue, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    {issue}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Default AI Message
  return (
    <div className="flex gap-3">
      <div className="w-9 h-9 bg-zinc-800 rounded-2xl flex items-center justify-center flex-shrink-0 mt-1">
        <Bot className="w-5 h-5 text-violet-400" />
      </div>
      <div className={`${baseClasses} bg-zinc-900 border-zinc-700 text-zinc-200`}>
        <p className="text-[15px] leading-relaxed">
          {typeof data === "string" ? data : data?.notes || "Thank you for your message."}
        </p>
      </div>
    </div>
  );
}