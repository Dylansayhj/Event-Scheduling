import { useState } from "react";
import { formatTime } from '../utils/utils';
import { TIME_SLOTS } from "../utils/constants/time_slots";
//import ShareLink from "./ShareLink";

function buildAllOverlapRanges(allOverlaps, totalUsers) {
  const results = [];
  const indexMap = Object.fromEntries(TIME_SLOTS.map((t, i) => [t, i]));

  Object.entries(allOverlaps).forEach(([dateKey, overlaps]) => {
    const slots = TIME_SLOTS.filter((t) => overlaps[t]?.length > 0);
    if (slots.length === 0) return;

    let rangeStart = null;
    let prevIndex = null;
    let rangeNames = null;

    const pushRange = (end) => {
      if (rangeStart && rangeNames?.size > 0) {
        const names = [...rangeNames];
        results.push({
          date: dateKey,
          start: rangeStart,
          end,
          names,
          ratio: totalUsers > 0 ? names.length / totalUsers : 0,
        });
      }
    };

    slots.forEach((slot) => {
      const idx = indexMap[slot];
      const names = overlaps[slot];

      if (prevIndex === null || idx !== prevIndex + 1) {
        pushRange(slots[slots.indexOf(slot) - 1] || rangeStart);
        rangeStart = slot;
        rangeNames = new Set(names);
      } else {
        rangeNames = new Set([...rangeNames].filter((n) => names.includes(n)));
      }
      prevIndex = idx;
    });

    pushRange(slots[slots.length - 1]);
  });

  return results
    .filter((r) => r.names.length > 0)
    .sort((a, b) => b.ratio - a.ratio || a.date.localeCompare(b.date));
}

function formatDateKey(dateKey) {
  const [y, m, d] = dateKey.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric",
  });
}

export default function EventSidebar({
  eventName, eventDescription, allNames, confirmed,
  eventId, allOverlaps, setConfirmed
}) {
  const [showConfirmPicker, setShowConfirmPicker] = useState(false);
  const [selectedRange, setSelectedRange] = useState(null);

  const totalUsers = allNames.length;
  const overlapRanges = buildAllOverlapRanges(allOverlaps, totalUsers);

  const confirmTime = () => {
    if (!selectedRange) return;
    const meta = { confirmed: { ...selectedRange } };
    localStorage.setItem(`${eventId}_meta`, JSON.stringify(meta));
    setConfirmed(meta.confirmed);
    setShowConfirmPicker(false);
    setSelectedRange(null);
  };

  return (
    <div className="w-full md:w-72 lg:w-80 bg-white border-b md:border-b-0 md:border-r border-[#e8dfd3] p-7 flex flex-col gap-6 shrink-0">

      {/* Event Details */}
      <div>
        <div className="inline-block bg-[#e8dfd3] text-[#b5956a] text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full mb-3">
          Event
        </div>
        <h1 className="font-serif text-2xl font-black text-[#1a1a18] leading-tight mb-2">{eventName}</h1>
        {eventDescription && (
          <p className="text-[#7a7268] text-sm leading-relaxed">{eventDescription}</p>
        )}
      </div>

      {/* Responded List */}
      {totalUsers > 0 && (
        <div>
          <div className="text-xs font-semibold text-[#2d4a3e] uppercase tracking-wider mb-2">
            Responded ({totalUsers})
          </div>
          <div className="flex flex-wrap gap-1.5">
            {allNames.map((name) => (
              <span key={name} className="bg-[#e8dfd3] text-[#7a7268] text-xs px-2.5 py-1 rounded-full">
                {name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Confirmed banner or host confirm section */}
      {confirmed ? (
        <div className="bg-[#e8f4ee] border border-[#a8c5bc] rounded-xl p-4">
          <div className="text-xs font-semibold text-[#2d4a3e] uppercase tracking-wider mb-2">
            ✓ Time Confirmed
          </div>
          <div className="text-[#7a7268] text-xs font-medium mb-0.5">{formatDateKey(confirmed.date)}</div>
          <div className="text-[#2d4a3e] font-bold text-base">
            {formatTime(confirmed.start)} – {formatTime(confirmed.end)}
          </div>
          <div className="text-[#7a7268] text-xs mt-1">{confirmed.names?.join(", ")}</div>
        </div>

      ) : totalUsers > 0 ? (
        <div className="border border-[#e8dfd3] rounded-xl p-4">
          <div className="text-xs font-semibold text-[#2d4a3e] uppercase tracking-wider mb-1">
            Host: Confirm a Time
          </div>

          {!showConfirmPicker ? (
            <>
              <p className="text-[#7a7268] text-xs mb-3">
                {overlapRanges.length > 0
                  ? `${overlapRanges.length} overlapping window${overlapRanges.length > 1 ? "s" : ""} found.`
                  : "Waiting for more responses to find overlaps."}
              </p>
              <button
                onClick={() => setShowConfirmPicker(true)}
                disabled={overlapRanges.length === 0}
                className="w-full bg-[#2d4a3e] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#3d6455] text-white text-xs font-semibold py-2.5 rounded-lg transition-all"
              >
                View Best Times
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2">
              <p className="text-[#7a7268] text-xs mb-1">Pick the best window for your group:</p>

              <div className="flex flex-col gap-1.5 max-h-52 overflow-y-auto">
                {overlapRanges.map((range, i) => {
                  const isSelected = selectedRange === range;
                  const allFree = range.names.length === totalUsers;
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedRange(isSelected ? null : range)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl border transition-all duration-150
                        ${isSelected
                          ? "bg-[#2d4a3e] border-[#2d4a3e] text-white"
                          : "bg-[#f7f3ee] border-[#e8dfd3] hover:border-[#2d4a3e]/40 text-[#1a1a18]"
                        }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-semibold uppercase tracking-wide opacity-60">
                          {formatDateKey(range.date)}
                        </span>
                        {allFree && (
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${isSelected ? "bg-white/20 text-white" : "bg-[#e8f4ee] text-[#2d4a3e]"}`}>
                            All free
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-bold mt-0.5">
                        {formatTime(range.start)} – {formatTime(range.end)}
                      </div>
                      <div className={`text-[10px] mt-0.5 ${isSelected ? "text-white/70" : "text-[#7a7268]"}`}>
                        {range.names.join(", ")} · {range.names.length}/{totalUsers}
                      </div>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={confirmTime}
                disabled={!selectedRange}
                className="w-full mt-1 bg-[#2d4a3e] disabled:opacity-40 hover:bg-[#3d6455] text-white text-xs font-semibold py-2.5 rounded-lg transition-all"
              >
                Confirm for Everyone
              </button>
              <button
                onClick={() => { setShowConfirmPicker(false); setSelectedRange(null); }}
                className="w-full text-[#7a7268] hover:text-[#2d4a3e] text-xs py-1 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
