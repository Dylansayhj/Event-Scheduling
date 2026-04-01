import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", description: "" });
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = () => {
    if (!form.name.trim()) {
      setErrors({ name: "Event name is required." });
      return;
    }
    const eventId = Math.random().toString(36).slice(2, 8);
    navigate(`/event/${eventId}`, { state: { ...form, eventId } });
  };

  return (
    <div className="min-h-screen bg-[#f7f3ee] flex flex-col items-center justify-center px-4 py-16">

      {/* Heading */}
      <div className="text-center mb-10">
        <h1 className="font-serif text-4xl md:text-5xl font-black text-[#1a1a18] tracking-tight leading-tight mb-3">
          Create an <span className="italic text-[#2d4a3e]">Event</span>
        </h1>
        <p className="text-[#7a7268] text-base max-w-sm mx-auto leading-relaxed">
          Mark when you and your friends are free and find the best time together!
        </p>
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-2xl border border-[#e8dfd3] shadow-[0_4px_24px_rgba(45,74,62,0.08)] p-8">

        {/* Event Name */}
        <div className="mb-5">
          <label className="block text-xs font-semibold text-[#2d4a3e] uppercase tracking-wider mb-2">
            Event Name
          </label>
          <input
            type="text"
            placeholder="e.g. Group Study Session"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border text-sm text-[#1a1a18] bg-white placeholder-[#b5a99a] outline-none transition-all duration-200 focus:ring-2 focus:ring-[#2d4a3e]/30 focus:border-[#2d4a3e] ${
              errors.name ? "border-red-300 bg-red-50" : "border-[#e8dfd3]"
            }`}
          />
          {errors.name && (
            <p className="text-red-400 text-xs mt-1.5">{errors.name}</p>
          )}
        </div>

        {/* Description */}
        <div className="mb-7">
          <label className="block text-xs font-semibold text-[#2d4a3e] uppercase tracking-wider mb-2">
            Description{" "}
            <span className="text-[#b5a99a] normal-case tracking-normal font-normal">
              (optional)
            </span>
          </label>
          <textarea
            placeholder="Add any details your group should know..."
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-[#e8dfd3] text-sm text-[#1a1a18] bg-white placeholder-[#b5a99a] outline-none transition-all duration-200 focus:ring-2 focus:ring-[#2d4a3e]/30 focus:border-[#2d4a3e] resize-none"
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          className="w-full bg-[#2d4a3e] hover:bg-[#3d6455] text-white font-semibold text-sm py-3.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#2d4a3e]/20 tracking-wide"
        >
          Create Event & Get Link →
        </button>
      </div>

      <p className="text-[#b5a99a] text-xs mt-6">
        No account needed · Share the link with your group
      </p>
    </div>
  );
}