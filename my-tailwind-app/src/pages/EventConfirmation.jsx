import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import { SiTiktok } from "react-icons/si";
import ShareLink from "../components/ShareLink";

export default function EventConfirmation() {
  const { eventId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { name, description } = location.state || {};

  const shareLink = `${window.location.origin}/event/${eventId}`;
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleAddAnother = () => {
    navigate(`/event/${eventId}`, { state: { name, description } });
  };

  return (
    <div className="min-h-screen bg-[#f7f3ee] flex flex-col items-center justify-start px-4 py-16">

      {/* Heading */}
      <div className="text-center mb-10">
        <h1 className="font-serif text-4xl md:text-5xl font-black text-[#1a1a18] tracking-tight leading-tight mb-3">
          Your <span className="italic text-[#2d4a3e]">Availability</span>
          <br />
          is confirmed!
        </h1>
      </div>

      <div className="w-full max-w-md bg-white rounded-2xl border border-[#e8dfd3] shadow-[0_4px_24px_rgba(45,74,62,0.08)] p-8">

        {/* Event info */}
        <h2 className="text-2xl font-bold text-[#1a1a18] mb-1">
          {name || "Your Event"}
        </h2>
        <p className="text-[#7a7268] text-sm mb-6 max-h-32 overflow-y-auto break-words">
          {description || "No description provided."}
        </p>

        {/* Share section */}
        <h3 className="text-lg font-semibold text-[#2d4a3e] mb-3">Share this event</h3>

        <div className="flex items-center gap-4 mb-6 text-2xl">
          <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareLink}`} target="_blank" rel="noopener noreferrer">
            <FaFacebook className="text-[#1877f2] hover:scale-110 transition" />
          </a>
          <a href={`https://twitter.com/intent/tweet?url=${shareLink}`} target="_blank" rel="noopener noreferrer">
            <FaTwitter className="text-[#1da1f2] hover:scale-110 transition" />
          </a>
          <a href={`https://wa.me/?text=${shareLink}`} target="_blank" rel="noopener noreferrer">
            <FaWhatsapp className="text-[#25d366] hover:scale-110 transition" />
          </a>
          <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareLink}`} target="_blank" rel="noopener noreferrer">
            <FaLinkedin className="text-[#0a66c2] hover:scale-110 transition" />
          </a>
          <button onClick={handleCopy} className="text-[#e1306c] hover:scale-110 transition" title={copied ? "Copied!" : "Copy link for Instagram"}>
            <FaInstagram />
          </button>
          <button onClick={handleCopy} className="text-black hover:scale-110 transition" title={copied ? "Copied!" : "Copy link for TikTok"}>
            <SiTiktok />
          </button>
        </div>

        <ShareLink eventId={eventId} label="Event Link" />

        <button
          onClick={handleAddAnother}
          className="w-full mt-4 border border-[#2d4a3e] text-[#2d4a3e] hover:bg-[#2d4a3e] hover:text-white font-semibold text-sm py-3 rounded-xl transition-all duration-200"
        >
          + Add Availability for Another Date
        </button>

      </div>
    </div>
  );
}