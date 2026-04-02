import { useState, useEffect, useRef, useCallback } from "react";
import { formatDateKey } from "../utils/utils";
import { getEventData, getOverlaps } from "../api/api";

import { BAR_HEIGHT, HOUR_LABELS } from "../utils/constants/time_bar";
import {
  minutesToY, yToMinutes, minutesToLabel,
  rangesToSlots, buildOverlapMap, mergeRanges,
} from "../utils/time_bar_utils";

const TOTAL_MINUTES = 720; 

export default function TimeSlotPanel({
  selectedDate, overlaps, setOverlaps, totalUsers, eventId, onSave,
}) {
  const [ranges, setRanges] = useState([]);
  const [dragging, setDragging] = useState(null);
  const [participantName, setParticipantName] = useState("");
  const [nameError, setNameError] = useState(false);
  const barRef = useRef(null);

  useEffect(() => {
    setRanges([]);
  }, [selectedDate]);

  const overlapMap = buildOverlapMap(overlaps);
  const clamp = (v) => Math.max(0, Math.min(TOTAL_MINUTES, v));

  const getMinutesFromEvent = useCallback((e) => {
    const rect = barRef.current.getBoundingClientRect();
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    return clamp(yToMinutes(y));
  }, []);

  const onMouseDown = (e) => {
    e.preventDefault();
    const m = getMinutesFromEvent(e);
    setDragging({ startMin: m, currentMin: m });
  };

  const onMouseMove = useCallback((e) => {
    if (!dragging) return;
    setDragging((d) => ({ ...d, currentMin: getMinutesFromEvent(e) }));
  }, [dragging, getMinutesFromEvent]);

  const onMouseUp = useCallback(() => {
    if (!dragging) return;
    const start = Math.min(dragging.startMin, dragging.currentMin);
    const end = Math.max(dragging.startMin, dragging.currentMin);
    if (end - start >= 15) {
      setRanges((prev) => mergeRanges(prev, start, end));
    }
    setDragging(null);
  }, [dragging]);

  const removeRange = (i) => setRanges((prev) => prev.filter((_, idx) => idx !== i));

  const saveAvailability = () => {
    if (!participantName.trim()) { setNameError(true); return; }
    if (ranges.length === 0) return;

    const data = getEventData(eventId);
    const name = participantName.trim();
    data[name] = { ...(data[name] || {}), [selectedDate]: rangesToSlots(ranges) };
    localStorage.setItem(eventId, JSON.stringify(data));
    setOverlaps(getOverlaps(eventId, selectedDate));
    onSave(name); 
  };

  const dragRange = dragging
    ? { start: Math.min(dragging.startMin, dragging.currentMin), end: Math.max(dragging.startMin, dragging.currentMin) }
    : null;

  if (!selectedDate) {
    return (
      <div className="flex-1 flex items-center justify-center text-center py-20 bg-white rounded-2xl border border-[#e8dfd3]">
        <div>
          <div className="text-4xl mb-3">📅</div>
          <p className="text-[#7a7268] text-sm">Pick a date to set your availability.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full lg:w-72 bg-white rounded-2xl border border-[#e8dfd3] shadow-[0_2px_16px_rgba(45,74,62,0.07)] p-5 flex flex-col">

      <h2 className="font-serif text-base font-bold text-[#1a1a18] mb-1 shrink-0">
        {formatDateKey(selectedDate)}
      </h2>
      <p className="text-[#7a7268] text-xs mb-4 shrink-0">
        Drag to mark when you're free. Drag again to add another range.
      </p>

      {/* Time bar */}
      <div className="flex gap-3 mb-4 select-none">

        {/* Hour labels */}
        <div className="flex flex-col justify-between shrink-0 text-right" style={{ height: BAR_HEIGHT }}>
          {HOUR_LABELS.map(({ label }) => (
            <span key={label} className="text-[10px] text-[#b5a99a] leading-none">{label}</span>
          ))}
        </div>

        {/* Drag bar */}
        <div
          ref={barRef}
          className="relative flex-1 rounded-xl overflow-hidden cursor-crosshair bg-[#f7f3ee] border border-[#e8dfd3]"
          style={{ height: BAR_HEIGHT }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onTouchStart={(e) => { e.preventDefault(); onMouseDown(e); }}
          onTouchMove={(e) => { e.preventDefault(); onMouseMove(e); }}
          onTouchEnd={onMouseUp}
        >
          {/* Hour gridlines */}
          {HOUR_LABELS.map(({ minutes }) => (
            <div key={minutes} className="absolute left-0 right-0 border-t border-[#e8dfd3]" style={{ top: minutesToY(minutes) }} />
          ))}

          {/* Overlap heat */}
          {Object.entries(overlapMap).map(([min, names]) => {
            const ratio = totalUsers > 0 ? names.length / totalUsers : 0;
            return (
              <div
                key={min}
                className="absolute left-0 right-0 pointer-events-none"
                style={{
                  top: minutesToY(parseInt(min)),
                  height: minutesToY(15),
                  backgroundColor: `rgba(45,74,62,${0.15 + ratio * 0.35})`,
                }}
              />
            );
          })}

          {/* Drawn ranges */}
          {ranges.map((r, i) => (
            <div
              key={i}
              className="absolute left-1 right-1 rounded-lg bg-[#2d4a3e] opacity-90 flex items-center justify-between px-2"
              style={{ top: minutesToY(r.start) + 1, height: Math.max(minutesToY(r.end - r.start) - 2, 16) }}
            >
              <span className="text-white text-[9px] font-semibold leading-none">
                {minutesToLabel(r.start)}–{minutesToLabel(r.end)}
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); removeRange(i); }}
                className="text-white/60 hover:text-white text-xs ml-1"
              >✕</button>
            </div>
          ))}

          {/* Drag preview */}
          {dragRange && dragRange.end - dragRange.start >= 5 && (
            <div
              className="absolute left-1 right-1 rounded-lg bg-[#2d4a3e] opacity-50 pointer-events-none"
              style={{ top: minutesToY(dragRange.start) + 1, height: Math.max(minutesToY(dragRange.end - dragRange.start) - 2, 4) }}
            />
          )}
        </div>
      </div>

      {/* Range summary */}
      {ranges.length > 0 && (
        <div className="mb-3 shrink-0">
          <div className="text-xs font-semibold text-[#2d4a3e] uppercase tracking-wider mb-1.5">Your availability</div>
          <div className="flex flex-col gap-1">
            {ranges.map((r, i) => (
              <div key={i} className="flex items-center justify-between bg-[#e8f4ee] border border-[#a8c5bc] rounded-lg px-3 py-1.5">
                <span className="text-xs font-medium text-[#2d4a3e]">{minutesToLabel(r.start)} – {minutesToLabel(r.end)}</span>
                <button onClick={() => removeRange(i)} className="text-[#7a7268] hover:text-red-400 text-xs transition-colors">✕</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Overlap legend */}
      {totalUsers > 0 && (
        <div className="flex items-center gap-3 mb-3 flex-wrap shrink-0">
          <span className="text-xs text-[#7a7268]">Others:</span>
          {[["rgba(45,74,62,0.15)", "Few"], ["rgba(45,74,62,0.35)", "Some"], ["rgba(45,74,62,0.5)", "Most"]].map(([bg, label]) => (
            <span key={label} className="flex items-center gap-1 text-xs text-[#7a7268]">
              <span className="w-2.5 h-2.5 rounded inline-block" style={{ background: bg, border: "1px solid #e8dfd3" }} />{label}
            </span>
          ))}
        </div>
      )}

      {/* Name and save */}
      <div className="shrink-0 border-t border-[#e8dfd3] pt-3 mt-auto">
        <div className="flex flex-col gap-2">
          <input
            type="text"
            placeholder="Your name"
            value={participantName}
            onChange={(e) => { setParticipantName(e.target.value); setNameError(false); }}
            className={`w-full px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-[#2d4a3e]/30 focus:border-[#2d4a3e]
              ${nameError ? "border-red-300 bg-red-50" : "border-[#e8dfd3]"}`}
          />
          {nameError && <p className="text-red-400 text-xs -mt-1">Please enter your name.</p>}
          <button
            onClick={saveAvailability}
            disabled={ranges.length === 0}
            className="w-full bg-[#2d4a3e] disabled:opacity-40 hover:bg-[#3d6455] text-white font-semibold text-xs py-2.5 rounded-lg transition-all duration-200"
          >
            Save My Availability
          </button>
        </div>
      </div>
    </div>
  );
}