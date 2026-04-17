import { useForm } from "../context/FormContext";
import { saveInteraction } from "../services/api";
import { useState, useEffect } from "react";
import { Calendar, Clock, User, MessageSquare, Pill, Activity, Smile } from "lucide-react";

export default function InteractionForm() {
  const { formData, setFormData } = useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const now = new Date();
    const currentDate = now.toISOString().split("T")[0];
    const currentTime = now.toTimeString().slice(0, 5);

    setFormData((prev) => ({
      ...prev,
      date: prev.date || currentDate,
      time: prev.time || currentTime,
    }));
  }, [setFormData]);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const payload = {
        hcp_id: formData.hcp_id || 1,
        hcp_name: formData.hcp_name || "",
        notes: formData.notes || "",
        sentiment: formData.sentiment || "neutral",
        product: formData.product || "",
        disease_area: formData.disease_area || "",
        date: formData.date,
        time: formData.time,
      };

      await saveInteraction(payload);
      
      alert("✅ Interaction saved successfully!");

      // Reset form
      setFormData({
        hcp_id: null,
        hcp_name: "",
        date: "",
        time: "",
        notes: "",
        product: "",
        disease_area: "",
        sentiment: "neutral",
      });

    } catch (error) {
      console.error(error);
      alert("❌ Failed to save interaction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
      {/* Dark Header */}
      <div className="bg-zinc-900 px-8 py-6 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-zinc-800 rounded-2xl flex items-center justify-center">
            <span className="text-2xl">📝</span>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-white">Log HCP Interaction</h2>
            <p className="text-zinc-500 text-sm mt-1">
              Record your meeting details with Healthcare Professionals
            </p>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-8">
        {/* HCP Name */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-zinc-400 mb-2">
            <User className="w-4 h-4" />
            Healthcare Professional (HCP)
          </label>
          <input
            type="text"
            className="w-full px-5 py-4 bg-zinc-900 border border-zinc-700 rounded-2xl focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 text-white placeholder-zinc-500 transition-all"
            placeholder="Dr. Sharma / Dr. Priya Singh..."
            value={formData.hcp_name || ""}
            onChange={(e) => setFormData({ ...formData, hcp_name: e.target.value })}
          />
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-zinc-400 mb-2">
              <Calendar className="w-4 h-4" />
              Date
            </label>
            <input
              type="date"
              className="w-full px-5 py-4 bg-zinc-900 border border-zinc-700 rounded-2xl focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 text-white"
              value={formData.date || ""}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-zinc-400 mb-2">
              <Clock className="w-4 h-4" />
              Time
            </label>
            <input
              type="time"
              className="w-full px-5 py-4 bg-zinc-900 border border-zinc-700 rounded-2xl focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 text-white"
              value={formData.time || ""}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            />
          </div>
        </div>

        {/* Topics Discussed */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-zinc-400 mb-2">
            <MessageSquare className="w-4 h-4" />
            Topics Discussed / Notes
          </label>
          <textarea
            className="w-full px-5 py-4 bg-zinc-900 border border-zinc-700 rounded-3xl focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 text-white placeholder-zinc-500 min-h-[130px] resize-y"
            placeholder="What was discussed during the interaction..."
            value={formData.notes || ""}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
        </div>

        {/* Product & Disease Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-zinc-400 mb-2">
              <Pill className="w-4 h-4" />
              Product
            </label>
            <input
              className="w-full px-5 py-4 bg-zinc-900 border border-zinc-700 rounded-2xl focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 text-white placeholder-zinc-500"
              placeholder="e.g. CardioGuard, NeuroRelief"
              value={formData.product || ""}
              onChange={(e) => setFormData({ ...formData, product: e.target.value })}
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-zinc-400 mb-2">
              <Activity className="w-4 h-4" />
              Disease Area
            </label>
            <input
              className="w-full px-5 py-4 bg-zinc-900 border border-zinc-700 rounded-2xl focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 text-white placeholder-zinc-500"
              placeholder="e.g. Cardiology, Oncology, Diabetes"
              value={formData.disease_area || ""}
              onChange={(e) => setFormData({ ...formData, disease_area: e.target.value })}
            />
          </div>
        </div>

        {/* Sentiment */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-zinc-400 mb-3">
            <Smile className="w-4 h-4" />
            Sentiment
          </label>
          <div className="grid grid-cols-3 gap-4">
            {[
              { value: "positive", label: "Positive", emoji: "😊", color: "border-emerald-500/30 hover:border-emerald-500" },
              { value: "neutral", label: "Neutral", emoji: "😐", color: "border-zinc-600 hover:border-zinc-500" },
              { value: "negative", label: "Negative", emoji: "😟", color: "border-red-500/30 hover:border-red-500" },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setFormData({ ...formData, sentiment: option.value })}
                className={`p-5 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 hover:scale-[1.03] bg-zinc-900 ${
                  formData.sentiment === option.value 
                    ? "border-violet-500 bg-zinc-800 shadow-md" 
                    : option.color
                }`}
              >
                <span className="text-3xl">{option.emoji}</span>
                <span className="font-medium text-zinc-200">{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading || !formData.hcp_name}
          className="w-full bg-violet-600 hover:bg-violet-500 disabled:bg-zinc-700 disabled:text-zinc-400 text-white font-semibold py-4 rounded-2xl transition-all flex items-center justify-center gap-3 text-lg mt-6 active:scale-[0.985]"
        >
          {loading ? (
            <>Saving Interaction...</>
          ) : (
            <>
              💾 Save Interaction
            </>
          )}
        </button>

        {!formData.hcp_name && (
          <p className="text-center text-xs text-zinc-500">
            HCP Name is required to save the interaction
          </p>
        )}
      </div>
    </div>
  );
}