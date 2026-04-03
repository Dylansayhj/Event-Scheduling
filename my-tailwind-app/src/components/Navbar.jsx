import { Link, useLocation } from "react-router-dom";

export default function Navbar({ eventName, eventId }) {
  const location = useLocation();
  const isEventPage = location.pathname.startsWith("/event/");
  const shareUrl = eventId ? `${window.location.origin}/event/${eventId}` : null;

  const handleCopy = () => {
    if (shareUrl) navigator.clipboard.writeText(shareUrl);
  };

  return (
    <nav className="sticky top-0 z-[100] flex items-center justify-between px-6 py-3 bg-white border-b border-[#e8dfd3]">
      <div className="flex items-center gap-2 min-w-0">
        <Link
          to="/"
          className="font-serif font-bold text-lg text-[#2d4a3e] shrink-0 no-underline hover:opacity-70 transition-opacity"
        >
          Scheduler
        </Link>

        {isEventPage && eventName && (
          <>
            <span className="text-[#e8dfd3] text-lg shrink-0">›</span>
            <span className="text-sm text-[#7a7268] font-medium truncate">
              {eventName}
            </span>
          </>
        )}
      </div>

      {/* Right — actions */}
      <div className="flex items-center gap-2 shrink-0">
        {isEventPage && shareUrl && (
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 bg-[#f7f3ee] hover:bg-[#e8dfd3] border border-[#e8dfd3] text-[#2d4a3e] text-xs font-semibold px-3 py-1.5 rounded-full transition-colors duration-200"
          >
            <span>🔗</span>
            Copy Link
          </button>
        )}
        <Link
          to="/"
          className="bg-[#2d4a3e] hover:bg-[#3d6455] text-white text-xs font-semibold px-3 py-1.5 rounded-full transition-colors duration-200 no-underline"
        >
          + New Event
        </Link>
      </div>

    </nav>
  );
}