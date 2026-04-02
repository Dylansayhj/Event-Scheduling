import { useLocation, useParams } from "react-router-dom";
import { useState } from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import { SiTiktok } from "react-icons/si";
export default function Event() {
  const { eventId } = useParams();
  
  const location = useLocation();
  const { name, description } = location.state || {};

  const shareLink = `${window.location.origin}/event/${eventId}`;
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);

  };
    // just for Instagram and TikTok
  const handleCopyAndOpen = (url) => {
  navigator.clipboard.writeText(shareLink);
  setCopied(true);

  setTimeout(() => {
      setCopied(false);
      window.open(url, "_blank");
    }, 1000);
    };
  const handleShareAndOpen = (url) => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
      window.open(url, "_blank");
    }, 1000);
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
         {/* Popup */}
          {copied && (
            <div className="mb-6 bg-[#2d4a3e] text-white px-4 py-2 rounded-lg shadow-lg text-sm animate-fadeIn">
              Link copied! Send it to your friend.
            </div>
          )}
      <div className="w-full max-w-md bg-white rounded-2xl border border-[#e8dfd3] shadow-[0_4px_24px_rgba(45,74,62,0.08)] p-8">
        
        {/* Title */}
        <h2 className="text-2xl font-bold text-[#1a1a18] mb-1">
          {name || "Your Event"}
        </h2>
        <p className="text-[#7a7268] text-sm mb-6 max-h-32 overflow-y-auto break-words">
          {description || "No description provided."}
        </p>

        {/* Share Section */}
        <h3 className="text-lg font-semibold text-[#2d4a3e] mb-3">
          Share this event
        </h3>

         <div className="flex items-center gap-4 mb-6 text-2xl">

        <button
            onClick={() =>
              handleShareAndOpen(`https://www.facebook.com/sharer/sharer.php?u=${shareLink}`)
            }
            className="text-[#1877f2] hover:scale-110 transition"
              >
            <FaFacebook />
        </button>

           <button
              onClick={() =>
                handleShareAndOpen(`https://twitter.com/intent/tweet?url=${shareLink}`)
              }
              className="text-[#1da1f2] hover:scale-110 transition"
            >
              <FaTwitter />
            </button>

            <button
              onClick={() =>
                handleShareAndOpen(`https://wa.me/?text=${shareLink}`)
              }
              className="text-[#25d366] hover:scale-110 transition"
            >
              <FaWhatsapp />
            </button>

           <button
              onClick={() =>
                handleShareAndOpen(`https://www.linkedin.com/sharing/share-offsite/?url=${shareLink}`)
              }
              className="text-[#0a66c2] hover:scale-110 transition"
            >
              <FaLinkedin />
            </button>


            {/* Instagram & TikTok (copy fallback) */}
            <button
                onClick={() => handleCopyAndOpen("https://www.instagram.com")}
                className="text-[#e1306c] hover:scale-110 transition"
            >
              <FaInstagram />
            </button>


            <button
                onClick={() => handleCopyAndOpen("https://www.tiktok.com")}
                className="text-black hover:scale-110 transition"
            >
              <SiTiktok />
            </button>

            </div>

        {/* Copy Link */}
        <div className="bg-[#f7f3ee] border border-[#e8dfd3] rounded-xl p-4 mb-4">
          <p className="text-sm text-[#7a7268] mb-1">Event Link</p>
          <p className="text-[#1a1a18] text-sm break-all">{shareLink}</p>
        </div>

        <button
          onClick={handleCopy}
          className="w-full bg-[#2d4a3e] hover:bg-[#3d6455] text-white font-semibold text-sm py-3.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#2d4a3e]/20"
        >
          {copied ? "Copied!" : "Copy Link"}
        </button>
      </div>
    </div>
  );
}