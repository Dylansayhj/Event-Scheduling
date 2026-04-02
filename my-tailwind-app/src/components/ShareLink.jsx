import { useState } from "react";

export default function ShareLink({ eventId, label = "Share Link" }) {
  const [copied, setCopied] = useState(false);
  const shareUrl = `${window.location.origin}/event/${eventId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <div className="text-xs font-semibold text-[#2d4a3e] uppercase tracking-wider mb-2">
        {label}
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-[#f7f3ee] border border-[#e8dfd3] rounded-lg px-3 py-2 text-xs text-[#7a7268] truncate font-mono">
          {shareUrl}
        </div>
        <button
          onClick={handleCopy}
          className="bg-[#2d4a3e] hover:bg-[#3d6455] text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors whitespace-nowrap"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );
}